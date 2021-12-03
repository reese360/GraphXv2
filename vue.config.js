module.exports = {
  css: {
    extract: process.env.NODE_ENV == "PRODUCTION" ? true : false,
    loaderOptions: {
      sass: {
        prependData: `@import "@/scss/_variables.scss"; @import "@/scss/_mixins.scss";`,
      },
    },
  },
};
