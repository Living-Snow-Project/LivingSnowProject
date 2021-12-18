import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';
import { pickerSelectStyles, formInputStyles } from '../../styles/FormInput';
import { AtlasTypes } from '../../lib/Atlas';

export const TypeSelector = ({recordType, setRecordType, setAtlasType}) => {
  return (
    <>
      <Text style={formInputStyles.optionStaticText}>
        Are you Taking a Sample or Reporting a Sighting?
      </Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        items={[
          {label: `I'm Taking a Sample`, value: `Sample`},
          {label: `I'm Reporting a Sighting`, value: `Sighting`},
          {label: `Atlas: Red Dot`, value: `Atlas: Red Dot`},
          {label: `Atlas: Red Dot with Sample`, value: `Atlas: Red Dot with Sample`},
          {label: `Atlas: Blue Dot`, value: `Atlas: Blue Dot`},
          {label: `Atlas: Blue Dot with Sample`, value: `Atlas: Blue Dot with Sample`}
        ]}
        onValueChange={value => {
          setRecordType(value);
          if (value.includes(`Atlas`)) {
            setAtlasType({atlasType: AtlasTypes.SnowAlgae});
          }
        }}
        value={recordType}
      />
    </>
  );
}

TypeSelector.propTypes = {
  recordType: PropTypes.string,
  setRecordType: PropTypes.func,
  setAtlasType: PropTypes.func,
};
