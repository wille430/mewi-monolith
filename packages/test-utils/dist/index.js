var r=require("minifaker");require("minifaker/locales/en");var e=require("@wille430/common");exports.randomEmail=function(){return(r.firstName()+"."+r.lastName()+"@"+r.domainName()).toLowerCase()},exports.randomPassword=function(){return".Abc123"+e.randomString(10)};
//# sourceMappingURL=index.js.map
