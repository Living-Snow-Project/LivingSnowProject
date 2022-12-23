import React, { useState, useRef } from "react";
import { CustomTextInput } from "./CustomTextInput";
import { AppSettings } from "../../../types/AppSettings";
import { getAppSettings, setAppSettings } from "../../../AppSettings";
import { Labels, Placeholders } from "../../constants/Strings";

export function UserIdentityInput() {
  const [{ name, organization }, setSettings] = useState<AppSettings>(
    getAppSettings()
  );
  const orgRef = useRef<any>(null);

  return (
    <>
      <CustomTextInput
        value={name}
        label={Labels.RecordFields.Name}
        placeholder={Placeholders.Settings.Username}
        onChangeText={(value) => {
          setSettings((prev) => ({
            ...setAppSettings({ ...prev, name: value }),
          }));
        }}
        onSubmitEditing={() => orgRef.current?.focus()}
        maxLength={50}
      />

      <CustomTextInput
        ref={orgRef}
        value={organization}
        label={Labels.RecordFields.Organization}
        placeholder={Placeholders.Settings.Organization}
        onChangeText={(value) => {
          setSettings((prev) => ({
            ...setAppSettings({ ...prev, organization: value }),
          }));
        }}
        maxLength={50}
      />
    </>
  );
}
