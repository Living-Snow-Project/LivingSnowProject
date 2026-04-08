import React from "react";
import { Avatar, Text, View, YStack } from "tamagui";
import { AlgaeRecord, isSample, recordDateFormat } from "@livingsnow/record";
import { Labels } from "../../constants";

const avatarColors = [
  // rose (Radix: tomato/crimson approximation)
  "#FDA4AF", // rose.300
  "#E11D48", // rose.600
  "#881337", // rose.900

  // fuchsia (Radix: pink approximation)
  "#F0ABFC", // fuchsia.300
  "#C026D3", // fuchsia.600
  "#701A75", // fuchsia.900

  // purple (Radix: purple)
  "#D8B4FE", // purple.300
  "#9333EA", // purple.600
  "#581C87", // purple.900

  // violet (Radix: violet)
  "#C4B5FD", // violet.300
  "#7C3AED", // violet.600
  "#4C1D95", // violet.900

  // indigo (Radix: indigo)
  "#A5B4FC", // indigo.300
  "#4F46E5", // indigo.600
  "#312E81", // indigo.900

  // blue (Radix: blue)
  "#93C5FD", // blue.300
  "#2563EB", // blue.600
  "#1E3A8A", // blue.900

  // lightBlue (Radix: sky approximation)
  "#7DD3FC", // lightBlue.300
  "#0284C7", // lightBlue.600
  "#0C4A6E", // lightBlue.900

  // darkBlue (Radix: blue dark approximation)
  "#60A5FA", // darkBlue.300
  "#1D4ED8", // darkBlue.600
  "#1E3A8A", // darkBlue.900

  // cyan (Radix: cyan)
  "#67E8F9", // cyan.300
  "#0891B2", // cyan.600
  "#164E63", // cyan.900

  // teal (Radix: teal)
  "#5EEAD4", // teal.300
  "#0D9488", // teal.600
  "#134E4A", // teal.900

  // green (Radix: green)
  "#86EFAC", // green.300
  "#16A34A", // green.600
  "#14532D", // green.900
];

function computeInitials(name: string): string {
  const splitName = name.split(" ");

  // ie. John Doe = JD
  if (splitName.length > 1 && splitName[1].length != 0) {
    return `${splitName[0][0]}${splitName[1][0]}`;
  }

  // ie. John = JO or "J "
  if (name.length > 1) {
    return `${name[0]}${name[1]}`;
  }

  // fallback (Community Scientist)
  return "CS";
}

function computeColor(name: string): string {
  const hash = name
    .split("")
    .map((char) => char.charCodeAt(0))
    .reduce((current, previous) => current + previous, 0);

  return avatarColors[hash % avatarColors.length];
}

type AvatarProps = {
  color: string;
  initials: string;
};

function computeAvatarProps(name: string): AvatarProps {
  return {
    color: computeColor(name),
    initials: computeInitials(name).toUpperCase(),
  };
}

// avoid recomputing initials and color
const userAvatars: Map<string, AvatarProps> = new Map();

function getAvatarProps(name: string): AvatarProps {
  let result = userAvatars.get(name);
  if (result) {
    return { ...result };
  }

  result = computeAvatarProps(name);

  userAvatars.set(name, { ...result });

  return { ...result };
}

function getAvatar(name: string) {
  const { color, initials } = getAvatarProps(name);

  return (
    <Avatar circular size="$5" mt="$1">
      <Avatar.Fallback
        backgroundColor={color as any}
        alignItems="center"
        justifyContent="center"
      >
        <Text color="white" fontWeight="bold" fontSize="$2">
          {initials}
        </Text>
      </Avatar.Fallback>
    </Avatar>
  );
}

function getUserStyle(name: string | undefined, org: string | undefined) {
  const newName = name || Labels.DefaultName;

  return {
    org: org ? <Text>{org}</Text> : null,
    name: <Text fontWeight="600">{newName}</Text>,
    avatar: getAvatar(newName),
  };
}

function getRecordInfo(record: AlgaeRecord, color: string) {
  return (
    <Text fontWeight="700" color={color as any}>
      {`${record.type}, ${recordDateFormat(record.date)}`}
    </Text>
  );
}

type UserStyleProps = {
  record: AlgaeRecord;
};

export function UserStyle({ record }: UserStyleProps) {
  const color = isSample(record.type) ? "$sampleColor" : "$sightingColor";
  const { avatar, name, org } = getUserStyle(record.name, record.organization);

  // TODO: not ideal width % spread across 2 components, rename to TimelineHeader and include actionsMenu?
  return (
    <>
      <View width="15%">{avatar}</View>
      <View width="78%" pr="$1">
        <YStack ml="$2">
          {name}
          {org}
          {getRecordInfo(record, color)}
        </YStack>
      </View>
    </>
  );
}
