const constants = {};
constants.maxMobileWidth = 768;
constants.maxTabletWidth = 1200;
constants.isMobile = () => {
    return document.body.clientWidth <= constants.maxMobileWidth;
}
constants.isTablet = () => {
    return document.body.clientWidth <= constants.maxTabletWidth;
}
constants.isDesktop = () => {
    return document.body.clientWidth > constants.maxMobileWidth;
}

export default constants;