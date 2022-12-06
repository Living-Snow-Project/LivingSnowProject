import React from "react";
import { Avatar, Text } from "native-base";

const avatarColors = [
  "rose.300",
  "rose.600",
  "rose.900",
  "fuchsia.300",
  "fuchsia.600",
  "fuchsia.900",
  "purple.300",
  "purple.600",
  "purple.900",
  "violet.300",
  "violet.600",
  "violet.900",
  "indigo.300",
  "indigo.600",
  "indigo.900",
  "blue.300",
  "blue.600",
  "blue.900",
  "lightBlue.300",
  "lightBlue.600",
  "lightBlue.900",
  "darkBlue.300",
  "darkBlue.600",
  "darkBlue.900",
  "cyan.300",
  "cyan.600",
  "cyan.900",
  "teal.300",
  "teal.600",
  "teal.900",
  "green.300",
  "green.600",
  "green.900",
];

type UserStyle = {
  org: JSX.Element | null;
  name: JSX.Element;
  avatar: JSX.Element;
};

function getInitials(name: string): string {
  const splitName = name.split(" ");

  // John Doe = JD
  if (splitName.length > 1) {
    return `${splitName[0][0]}${splitName[1][0]}`;
  }

  // John = JO
  if (name.length > 1) {
    return `${name[0]}${name[1]}`;
  }

  // fallback (Community Scientist)
  return "CS";
}

function getColor(name: string): string {
  const hash = name
    .split("")
    .map((char) => char.charCodeAt(0))
    .reduce((current, previous) => current + previous, 0);

  return avatarColors[hash % avatarColors.length];
}

function getOrganization(org: string | undefined): JSX.Element | null {
  if (org) {
    return <Text>{org}</Text>;
  }

  return null;
}

type AvatarProps = {
  color: string;
  initials: string;
};

function computeAvatarProps(name: string) {
  return {
    color: getColor(name),
    initials: getInitials(name).toUpperCase(),
  };
}

const userStyles: Map<string, AvatarProps> = new Map();

function getAvatarProps(name: string): AvatarProps {
  // lookup
  let result = userStyles.get(name);
  if (result) {
    return { ...result };
  }

  result = computeAvatarProps(name);

  userStyles.set(name, { ...result });

  return { ...result };
}

function getAvatar(name: string) {
  const { color, initials } = getAvatarProps(name);

  return (
    <Avatar mt={1} bg={color}>
      {initials}
    </Avatar>
  );
}

export default function getUserStyle(
  name: string | undefined,
  org: string | undefined
): UserStyle {
  const newName = name || "Community Scientist";

  return {
    org: getOrganization(org),
    name: <Text fontWeight={600}>{newName}</Text>,
    avatar: getAvatar(newName),
  };
}
