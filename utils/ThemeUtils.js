const buildThemingProps = (theme, themeProps) => {
    return {
        theme: theme,
        themeCompose: themeProps.compose,
        themePrefix: themeProps.prefix
    };
};

export default buildThemingProps;