const constants = {};
constants.maxMobileWidth = 768;
constants.isMobile = () => {
    return document.body.clientWidth <= constants.maxMobileWidth;
}
constants.isDesktop = () => {
    return document.body.clientWidth > constants.maxMobileWidth;
}

export default constants;