(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[820],{3233:function(e,t,r){"use strict";var n=r(8655),o=r(810),i=r(7967),l=r(6428),s=r(8383);Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return y}});var c=r(3166),a=r(7458),u=c._(r(2983)),d=c._(r(5119)),f={400:"Bad Request",404:"This page could not be found",405:"Method Not Allowed",500:"Internal Server Error"};function p(e){var t=e.res,r=e.err;return{statusCode:t&&t.statusCode?t.statusCode:r?r.statusCode:404}}var h={error:{fontFamily:'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',height:"100vh",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},desc:{lineHeight:"48px"},h1:{display:"inline-block",margin:"0 20px 0 0",paddingRight:23,fontSize:24,fontWeight:500,verticalAlign:"top"},h2:{fontSize:14,fontWeight:400,lineHeight:"28px"},wrap:{display:"inline-block"}},y=function(e){i(c,e);var t,r=(t=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}(),function(){var e,r=s(c);if(t){var n=s(this).constructor;e=Reflect.construct(r,arguments,n)}else e=r.apply(this,arguments);return l(this,e)});function c(){return n(this,c),r.apply(this,arguments)}return o(c,[{key:"render",value:function(){var e=this.props,t=e.statusCode,r=e.withDarkMode,n=this.props.title||f[t]||"An unexpected error has occurred";return(0,a.jsxs)("div",{style:h.error,children:[(0,a.jsx)(d.default,{children:(0,a.jsx)("title",{children:t?t+": "+n:"Application error: a client-side exception has occurred"})}),(0,a.jsxs)("div",{style:h.desc,children:[(0,a.jsx)("style",{dangerouslySetInnerHTML:{__html:"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}"+(void 0===r||r?"@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}":"")}}),t?(0,a.jsx)("h1",{className:"next-error-h1",style:h.h1,children:t}):null,(0,a.jsx)("div",{style:h.wrap,children:(0,a.jsxs)("h2",{style:h.h2,children:[this.props.title||t?n:(0,a.jsx)(a.Fragment,{children:"Application error: a client-side exception has occurred (see the browser console for more information)"}),"."]})})]})]})}}]),c}(u.default.Component);y.displayName="ErrorPage",y.getInitialProps=p,y.origGetInitialProps=p,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9858:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_error",function(){return r(3233)}])}},function(e){e.O(0,[888,774,179],function(){return e(e.s=9858)}),_N_E=e.O()}]);