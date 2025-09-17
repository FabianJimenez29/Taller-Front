module.exportsmodule.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-worklets/plugin',
        {
          globals: ['__reanimatedWorkletInit'],
          relativeSourceLocation: true,
        },
      ],
    ],
  };
};) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-worklets/plugin',
        {
          globals: ['__reanimatedWorkletInit'],
          relativeSourceLocation: true,
        },
      ],
    ],
  };
}; function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-worklets/plugin',
        {
          globals: ['__reanimatedWorkletInit'],
          relativeSourceLocation: true,
        },
      ],
    ],
  };
};;
  