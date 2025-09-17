import {
  PublicClientApplication,
  AccountInfo,
  SilentRequest,
} from "@azure/msal-browser";

interface CachedToken {
  token: string;
  expiresAt: number; // timestamp in milliseconds
}

class TokenManager {
  private cachedToken: CachedToken | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private msalInstance: PublicClientApplication;
  private tokenRequest: {
    scopes: string[];
    account: AccountInfo | null;
  };

  constructor(msalInstance: PublicClientApplication) {
    this.msalInstance = msalInstance;
    this.tokenRequest = {
      scopes: ["api://2e007b80-946b-4296-8831-91a95e0b992c/access_as_user"],
      account: null,
    };
  }

  public setAccount(account: AccountInfo) {
    this.tokenRequest.account = account;
  }

  public async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.cachedToken && this.isTokenValid()) {
      return this.cachedToken.token;
    }

    // Need to refresh the token
    return await this.refreshToken();
  }

  private isTokenValid(): boolean {
    if (!this.cachedToken) return false;

    // Consider token invalid if it expires within the next minute
    const bufferTime = 60 * 1000; // 1 minute buffer
    return Date.now() + bufferTime < this.cachedToken.expiresAt;
  }

  private async refreshToken(): Promise<string> {
    if (!this.tokenRequest.account) {
      throw new Error("No account available for token refresh");
    }

    try {
      let response;

      try {
        // Try silent token acquisition first
        response = await this.msalInstance.acquireTokenSilent(
          this.tokenRequest as SilentRequest,
        );
      } catch (error) {
        // If silent acquisition fails, fall back to interactive
        response = await this.msalInstance.acquireTokenPopup(
          this.tokenRequest as SilentRequest,
        );
      }

      // Cache the new token
      this.cachedToken = {
        token: response.accessToken,
        expiresAt: response.expiresOn?.getTime() || Date.now() + 60 * 60 * 1000, // default 1 hour if no expiry
      };

      // Schedule the next refresh (5 minutes before expiry)
      this.scheduleRefresh();

      return response.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }

  private scheduleRefresh(): void {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.cachedToken) return;

    // Schedule refresh 5 minutes before token expires
    const refreshTime = this.cachedToken.expiresAt - Date.now() - 5 * 60 * 1000; // 5 minutes before expiry

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        try {
          await this.refreshToken();
          console.log("Token refreshed automatically");
        } catch (error) {
          console.error("Automatic token refresh failed:", error);
        }
      }, refreshTime);
    }
  }

  public startTokenManagement(account: AccountInfo): void {
    this.setAccount(account);
    // Pre-fetch token and start management
    this.getAccessToken().catch((error) => {
      console.error("Initial token acquisition failed:", error);
    });
  }

  public stopTokenManagement(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.cachedToken = null;
    this.tokenRequest.account = null;
  }

  public clearCache(): void {
    this.cachedToken = null;
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

export default TokenManager;
