(()=>{var e={};e.id=331,e.ids=[331],e.modules={53524:e=>{"use strict";e.exports=require("@prisma/client")},47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},63477:e=>{"use strict";e.exports=require("querystring")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},15779:(e,s,r)=>{"use strict";r.r(s),r.d(s,{GlobalError:()=>n.a,__next_app__:()=>m,originalPathname:()=>u,pages:()=>d,routeModule:()=>p,tree:()=>c});var t=r(50482),i=r(69108),a=r(62563),n=r.n(a),o=r(68300),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);r.d(s,l);let c=["",{children:["admin",{children:["categories",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,9247)),"/Users/corinfogarty/Desktop/Dev Playground/Training/app/admin/categories/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,66294)),"/Users/corinfogarty/Desktop/Dev Playground/Training/app/admin/layout.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,78062)),"/Users/corinfogarty/Desktop/Dev Playground/Training/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,69361,23)),"next/dist/client/components/not-found-error"]}],d=["/Users/corinfogarty/Desktop/Dev Playground/Training/app/admin/categories/page.tsx"],u="/admin/categories/page",m={require:r,loadChunk:()=>Promise.resolve()},p=new t.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/admin/categories/page",pathname:"/admin/categories",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},66421:(e,s,r)=>{Promise.resolve().then(r.bind(r,72563))},35318:(e,s,r)=>{Promise.resolve().then(r.bind(r,45778))},16843:(e,s,r)=>{Promise.resolve().then(r.bind(r,94332))},20796:(e,s,r)=>{Promise.resolve().then(r.t.bind(r,2583,23)),Promise.resolve().then(r.t.bind(r,26840,23)),Promise.resolve().then(r.t.bind(r,38771,23)),Promise.resolve().then(r.t.bind(r,13225,23)),Promise.resolve().then(r.t.bind(r,9295,23)),Promise.resolve().then(r.t.bind(r,43982,23))},72563:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>d});var t=r(95344),i=r(3729),a=r(78154),n=r(45544),o=r(73750),l=r(48152),c=r(48396);function d(){let[e,s]=(0,i.useState)([]),[r,d]=(0,i.useState)(!0),[u,m]=(0,i.useState)(!1),[p,g]=(0,i.useState)(null),[h,x]=(0,i.useState)({name:"",description:"",defaultImage:""});(0,i.useEffect)(()=>{v()},[]);let v=async()=>{try{let e=await fetch("/api/categories");if(!e.ok)throw Error("Failed to fetch categories");let r=await e.json();s(r)}catch(e){console.error("Error fetching categories:",e)}finally{d(!1)}},y=async e=>{e.preventDefault();try{let e=p?`/api/categories/${p.id}`:"/api/categories";if(!(await fetch(e,{method:p?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(h)})).ok)throw Error("Failed to save category");v(),f()}catch(e){console.error("Error saving category:",e)}},j=async e=>{if(window.confirm("Are you sure you want to delete this category?"))try{if(!(await fetch(`/api/categories/${e}`,{method:"DELETE"})).ok)throw Error("Failed to delete category");v()}catch(e){console.error("Error deleting category:",e)}},f=()=>{m(!1),g(null),x({name:"",description:"",defaultImage:""})},b=e=>{g(e),x({name:e.name,description:e.description||"",defaultImage:e.defaultImage||""}),m(!0)};return r?t.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{minHeight:"200px"},children:t.jsx("div",{className:"spinner-border text-primary",role:"status",children:t.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):t.jsx(c.Z,{children:(0,t.jsxs)("div",{className:"p-4",children:[(0,t.jsxs)("div",{className:"d-flex justify-content-between align-items-center mb-4",children:[(0,t.jsxs)("div",{children:[t.jsx("h1",{className:"h3 mb-1",children:"Categories"}),t.jsx("p",{className:"text-muted mb-0",children:"Manage training categories"})]}),t.jsx(a.Z,{onClick:()=>m(!0),children:"Add Category"})]}),(0,t.jsxs)(n.Z,{hover:!0,responsive:!0,children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{children:[t.jsx("th",{children:"Name"}),t.jsx("th",{children:"Description"}),t.jsx("th",{children:"Resources"}),t.jsx("th",{children:"Created"}),t.jsx("th",{children:"Actions"})]})}),t.jsx("tbody",{children:e.map(e=>(0,t.jsxs)("tr",{children:[t.jsx("td",{children:e.name}),t.jsx("td",{children:e.description}),(0,t.jsxs)("td",{children:[e._count.resources," resources"]}),t.jsx("td",{children:new Date(e.createdAt).toLocaleDateString()}),(0,t.jsxs)("td",{children:[t.jsx(a.Z,{variant:"outline-primary",size:"sm",className:"me-2",onClick:()=>b(e),children:"Edit"}),t.jsx(a.Z,{variant:"outline-danger",size:"sm",onClick:()=>j(e.id),children:"Delete"})]})]},e.id))})]}),(0,t.jsxs)(o.Z,{show:u,onHide:f,children:[t.jsx(o.Z.Header,{closeButton:!0,children:t.jsx(o.Z.Title,{children:p?"Edit Category":"Add Category"})}),t.jsx(o.Z.Body,{children:(0,t.jsxs)(l.Z,{onSubmit:y,children:[(0,t.jsxs)(l.Z.Group,{className:"mb-3",children:[t.jsx(l.Z.Label,{children:"Name"}),t.jsx(l.Z.Control,{type:"text",value:h.name,onChange:e=>x({...h,name:e.target.value}),required:!0})]}),(0,t.jsxs)(l.Z.Group,{className:"mb-3",children:[t.jsx(l.Z.Label,{children:"Description"}),t.jsx(l.Z.Control,{as:"textarea",rows:3,value:h.description,onChange:e=>x({...h,description:e.target.value})})]}),(0,t.jsxs)(l.Z.Group,{className:"mb-3",children:[t.jsx(l.Z.Label,{children:"Default Image URL"}),t.jsx(l.Z.Control,{type:"url",value:h.defaultImage,onChange:e=>x({...h,defaultImage:e.target.value})})]}),(0,t.jsxs)("div",{className:"d-flex justify-content-end gap-2",children:[t.jsx(a.Z,{variant:"secondary",onClick:f,children:"Cancel"}),t.jsx(a.Z,{variant:"primary",type:"submit",children:p?"Save Changes":"Add Category"})]})]})})]})]})})}},45778:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>m});var t=r(95344),i=r(55070),a=r(60646),n=r(22254),o=r(20783),l=r.n(o),c=r(89895),d=r(13012),u=r(13746);function m({children:e}){let s=(0,n.usePathname)();return(0,t.jsxs)("div",{className:"d-flex",children:[t.jsx("div",{className:"bg-dark text-white",style:{width:"240px",minHeight:"100vh"},children:(0,t.jsxs)("div",{className:"p-3",children:[t.jsx("h5",{className:"mb-4",children:"Admin Panel"}),(0,t.jsxs)(i.Z,{className:"flex-column",children:[(0,t.jsxs)(l(),{href:"/admin/users",className:`nav-link ${"/admin/users"===s?"active":""}`,children:[t.jsx(c.Z,{size:16,className:"me-2"}),"Users"]}),(0,t.jsxs)(l(),{href:"/admin/categories",className:`nav-link ${"/admin/categories"===s?"active":""}`,children:[t.jsx(d.Z,{size:16,className:"me-2"}),"Categories"]}),(0,t.jsxs)(l(),{href:"/admin/settings",className:`nav-link ${"/admin/settings"===s?"active":""}`,children:[t.jsx(u.Z,{size:16,className:"me-2"}),"Settings"]})]})]})}),t.jsx("div",{className:"flex-grow-1 bg-light",children:t.jsx(a.Z,{className:"py-4",children:e})})]})}},94332:(e,s,r)=>{"use strict";r.r(s),r.d(s,{Providers:()=>a});var t=r(95344),i=r(47674);function a({children:e,session:s}){return t.jsx(i.SessionProvider,{session:s,children:e})}},48396:(e,s,r)=>{"use strict";r.d(s,{Z:()=>l});var t=r(95344),i=r(47674),a=r(22254),n=r(3729),o=r(7917);function l({children:e}){let{data:s,status:r}=(0,i.useSession)(),l=(0,a.useRouter)();return((0,n.useEffect)(()=>{"unauthenticated"===r?l.push("/auth/signin"):"authenticated"!==r||s?.user?.isAdmin||l.push("/")},[r,s,l]),"loading"===r)?t.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{minHeight:"200px"},children:t.jsx("div",{className:"spinner-border text-primary",role:"status",children:t.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):s?.user?.isAdmin?t.jsx(t.Fragment,{children:e}):(0,t.jsxs)(o.Z,{variant:"danger",className:"m-4",children:[t.jsx(o.Z.Heading,{children:"Access Denied"}),t.jsx("p",{children:"You need administrator privileges to access this page."})]})}},45544:(e,s,r)=>{"use strict";r.d(s,{Z:()=>l});var t=r(34132),i=r.n(t),a=r(3729),n=r(70136),o=r(95344);let l=a.forwardRef(({bsPrefix:e,className:s,striped:r,bordered:t,borderless:a,hover:l,size:c,variant:d,responsive:u,...m},p)=>{let g=(0,n.vE)(e,"table"),h=i()(s,g,d&&`${g}-${d}`,c&&`${g}-${c}`,r&&`${g}-${"string"==typeof r?`striped-${r}`:"striped"}`,t&&`${g}-bordered`,a&&`${g}-borderless`,l&&`${g}-hover`),x=(0,o.jsx)("table",{...m,className:h,ref:p});if(u){let e=`${g}-responsive`;return"string"==typeof u&&(e=`${e}-${u}`),(0,o.jsx)("div",{className:e,children:x})}return x})},9247:(e,s,r)=>{"use strict";r.r(s),r.d(s,{$$typeof:()=>a,__esModule:()=>i,default:()=>n});let t=(0,r(86843).createProxy)(String.raw`/Users/corinfogarty/Desktop/Dev Playground/Training/app/admin/categories/page.tsx`),{__esModule:i,$$typeof:a}=t,n=t.default},66294:(e,s,r)=>{"use strict";r.r(s),r.d(s,{$$typeof:()=>a,__esModule:()=>i,default:()=>n});let t=(0,r(86843).createProxy)(String.raw`/Users/corinfogarty/Desktop/Dev Playground/Training/app/admin/layout.tsx`),{__esModule:i,$$typeof:a}=t,n=t.default},78062:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>m,metadata:()=>u});var t=r(25036),i=r(86843);let a=(0,i.createProxy)(String.raw`/Users/corinfogarty/Desktop/Dev Playground/Training/app/providers.tsx`),{__esModule:n,$$typeof:o}=a;a.default;let l=(0,i.createProxy)(String.raw`/Users/corinfogarty/Desktop/Dev Playground/Training/app/providers.tsx#Providers`);var c=r(81355),d=r(3205);r(47453),r(67272);let u={title:"Training Hub",description:"A platform for organizing training resources"};async function m({children:e}){let s=await (0,c.getServerSession)(d.L);return(0,t.jsxs)("html",{lang:"en",children:[t.jsx("head",{children:t.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",rel:"stylesheet"})}),t.jsx("body",{children:t.jsx(l,{session:s,children:t.jsx("main",{children:e})})})]})}},3205:(e,s,r)=>{"use strict";r.d(s,{L:()=>n});var t=r(65822),i=r(3214),a=r(10375);let n={secret:process.env.NEXTAUTH_SECRET,adapter:(0,t.N)(i._),debug:!0,providers:[(0,a.Z)({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET,authorization:{params:{prompt:"select_account"}}})],session:{strategy:"jwt",maxAge:2592e3},callbacks:{signIn:async({user:e,account:s})=>(console.log("Sign in callback:",{user:e,account:s}),await i._.user.update({where:{email:e.email},data:{lastLogin:new Date,image:e.image||void 0}}),!0),async jwt({token:e,user:s,account:r,trigger:t}){if(console.log("JWT callback:",{token:e,user:s,trigger:t}),"signIn"===t||"signUp"===t){let s=await i._.user.findUnique({where:{email:e.email}});e.isAdmin=s?.isAdmin||!1,e.userId=s?.id}return e},session:async({session:e,token:s})=>(console.log("Session callback:",{session:e,token:s}),e?.user&&(e.user.isAdmin=s.isAdmin,e.user.id=s.userId),e)},pages:{signIn:"/auth/signin",error:"/auth/error"}}},3214:(e,s,r)=>{"use strict";r.d(s,{_:()=>i});var t=r(53524);let i=global.prisma||new t.PrismaClient},67272:()=>{}};var s=require("../../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),t=s.X(0,[431,217,761,190,568,750,268],()=>r(15779));module.exports=t})();