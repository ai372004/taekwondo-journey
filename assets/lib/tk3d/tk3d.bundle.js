/* Taekwondo Journey · 3D characters as ONE classic script (three.js r160, MIT licence below + tk3d), for when the game is opened straight from the folder (file://), where browsers refuse ES modules. Built from tk3d.js / character.js / kicks.js with: esbuild tk3d.js --bundle --format=iife --global-name=TKD3D --minify --legal-comments=eof — rebuild it whenever those change. */
var TKD3D=(()=>{var Ns=Object.defineProperty;var xh=Object.getOwnPropertyDescriptor;var Mh=Object.getOwnPropertyNames;var Sh=Object.prototype.hasOwnProperty;var bh=(r,e)=>{for(var t in e)Ns(r,t,{get:e[t],enumerable:!0})},Eh=(r,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Mh(e))!Sh.call(r,n)&&n!==t&&Ns(r,n,{get:()=>e[n],enumerable:!(i=xh(e,n))||i.enumerable});return r};var Th=r=>Eh(Ns({},"__esModule",{value:!0}),r);var mp={};bh(mp,{KICK_ANIM:()=>ch,OUTLINE:()=>No,Player3D:()=>Cs,Skeleton3D:()=>Xi,character:()=>pp,kickAnim:()=>hh,poseAt:()=>lh,quality:()=>op,supported:()=>sh,warmup:()=>dp});var va="160";var Sc=1,wh=2,ii=3,yi=0,dt=1,sr=2;var Pi=100;var ya=204,xa=205;var bc=0,Ah=1,Rh=2,_i=0,Ch=1,Lh=2,Ph=3,yo=4,Ih=5,Uh=6;var Ec=300,mn=301,fn=302,Ma=303,Sa=304,xs=306,ba=1e3,ri=1001,Ea=1002,_t=1003,Qo=1004;var Os=1005;var Et=1006,Dh=1007;var Xr=1008;var Ni=1009;var xo=1012,Tc=1013,fi=1014,gi=1015,Jn=1016,wc=1017,Ac=1018,Oi=1020;var Pt=1023;var Fi=1026,gn=1027;var Rc=1029;var Cc=1031,Lc=1033,Fs=33776,Bs=33777,zs=33778,Hs=33779,el=35840,tl=35841,il=35842,nl=35843,Pc=36196,rl=37492,sl=37496,al=37808,ol=37809,ll=37810,cl=37811,hl=37812,ul=37813,dl=37814,pl=37815,ml=37816,fl=37817,gl=37818,_l=37819,vl=37820,yl=37821,ks=36492,xl=36494,Ml=36495;var Sl=36284,bl=36285,El=36286;var jr=2300,qr=2301,Gs=2302,Tl=2400,wl=2401,Al=2402;var Ic=3e3,Bi=3001;var Yt="",Je="srgb",si="srgb-linear",Mo="display-p3",Ms="display-p3-linear",Yr="linear",He="srgb",Zr="rec709",Jr="p3";var Yi=7680;var Rl=35044;var Cl="300 es",Ta=1035,_n=2e3,Kr=2001,xi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let i=this._listeners[e];if(i!==void 0){let n=i.indexOf(t);n!==-1&&i.splice(n,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let i=t.slice(0);for(let n=0,s=i.length;n<s;n++)i[n].call(this,e);e.target=null}}},ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Wr=Math.PI/180,wa=180/Math.PI;function Ln(){let r=4294967295*Math.random()|0,e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,i=4294967295*Math.random()|0;return(ht[255&r]+ht[r>>8&255]+ht[r>>16&255]+ht[r>>24&255]+"-"+ht[255&e]+ht[e>>8&255]+"-"+ht[e>>16&15|64]+ht[e>>24&255]+"-"+ht[63&t|128]+ht[t>>8&255]+"-"+ht[t>>16&255]+ht[t>>24&255]+ht[255&i]+ht[i>>8&255]+ht[i>>16&255]+ht[i>>24&255]).toLowerCase()}function rt(r,e,t){return Math.max(e,Math.min(t,r))}function Nh(r,e){return(r%e+e)%e}function Vs(r,e,t){return(1-t)*r+t*e}function Ll(r){return(r&r-1)==0&&r!==0}function Aa(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function zn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function xt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(4294967295*r);case Uint16Array:return Math.round(65535*r);case Uint8Array:return Math.round(255*r);case Int32Array:return Math.round(2147483647*r);case Int16Array:return Math.round(32767*r);case Int8Array:return Math.round(127*r);default:throw new Error("Invalid component type.")}}var le=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(rt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),n=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*n+e.x,this.y=s*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Re=class r{constructor(e,t,i,n,s,a,o,l,c){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c)}set(e,t,i,n,s,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],p=i[5],g=i[8],_=n[0],m=n[3],y=n[6],f=n[1],v=n[4],b=n[7],R=n[2],M=n[5],A=n[8];return s[0]=a*_+o*f+l*R,s[3]=a*m+o*v+l*M,s[6]=a*y+o*b+l*A,s[1]=c*_+h*f+u*R,s[4]=c*m+h*v+u*M,s[7]=c*y+h*b+u*A,s[2]=d*_+p*f+g*R,s[5]=d*m+p*v+g*M,s[8]=d*y+p*b+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*s*h+i*o*l+n*s*c-n*a*l}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*s,p=c*s-a*l,g=t*u+i*d+n*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(n*c-h*i)*_,e[2]=(o*i-n*a)*_,e[3]=d*_,e[4]=(h*t-n*l)*_,e[5]=(n*s-o*t)*_,e[6]=p*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-n*c,n*l,-n*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ws.makeScale(e,t)),this}rotate(e){return this.premultiply(Ws.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ws.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ws=new Re;function Uc(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function $r(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Oh(){let r=$r("canvas");return r.style.display="block",r}var Pl={};function Xn(r){r in Pl||(Pl[r]=!0,console.warn(r))}var Il=new Re().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ul=new Re().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),fr={[si]:{transfer:Yr,primaries:Zr,toReference:r=>r,fromReference:r=>r},[Je]:{transfer:He,primaries:Zr,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[Ms]:{transfer:Yr,primaries:Jr,toReference:r=>r.applyMatrix3(Ul),fromReference:r=>r.applyMatrix3(Il)},[Mo]:{transfer:He,primaries:Jr,toReference:r=>r.convertSRGBToLinear().applyMatrix3(Ul),fromReference:r=>r.applyMatrix3(Il).convertLinearToSRGB()}},Fh=new Set([si,Ms]),Be={enabled:!0,_workingColorSpace:si,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!Fh.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,e,t){if(this.enabled===!1||e===t||!e||!t)return r;let i=fr[e].toReference;return(0,fr[t].fromReference)(i(r))},fromWorkingColorSpace:function(r,e){return this.convert(r,this._workingColorSpace,e)},toWorkingColorSpace:function(r,e){return this.convert(r,e,this._workingColorSpace)},getPrimaries:function(r){return fr[r].primaries},getTransfer:function(r){return r===Yt?Yr:fr[r].transfer}};function dn(r){return r<.04045?.0773993808*r:Math.pow(.9478672986*r+.0521327014,2.4)}function Xs(r){return r<.0031308?12.92*r:1.055*Math.pow(r,.41666)-.055}var Zi,Qr=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Zi===void 0&&(Zi=$r("canvas")),Zi.width=e.width,Zi.height=e.height;let i=Zi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Zi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=$r("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let n=i.getImageData(0,0,e.width,e.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=255*dn(s[a]/255);return i.putImageData(n,0,0),t}if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(255*dn(t[i]/255)):t[i]=dn(t[i]);return{data:t,width:e.width,height:e.height}}return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Bh=0,es=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Bh++}),this.uuid=Ln(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(js(n[a].image)):s.push(js(n[a]))}else s=js(n);i.url=s}return t||(e.images[this.uuid]=i),i}};function js(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Qr.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var zh=0,It=class r extends xi{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,i=1001,n=1001,s=1006,a=1008,o=1023,l=1009,c=r.DEFAULT_ANISOTROPY,h=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zh++}),this.uuid=Ln(),this.name="",this.source=new es(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Re,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Xn("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Bi?Je:Yt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ec)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ba:e.x=e.x-Math.floor(e.x);break;case ri:e.x=e.x<0?0:1;break;case Ea:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case ba:e.y=e.y-Math.floor(e.y);break;case ri:e.y=e.y<0?0:1;break;case Ea:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Xn("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Je?Bi:Ic}set encoding(e){Xn("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Bi?Je:Yt}};It.DEFAULT_IMAGE=null,It.DEFAULT_MAPPING=Ec,It.DEFAULT_ANISOTROPY=1;var Ye=class r{constructor(e=0,t=0,i=0,n=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,s,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],_=l[2],m=l[6],y=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,b=(p+1)/2,R=(y+1)/2,M=(h+d)/4,A=(u+_)/4,U=(g+m)/4;return v>b&&v>R?v<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(v),n=M/i,s=A/i):b>R?b<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(b),i=M/n,s=U/n):R<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(R),i=A/s,n=U/s),this.set(i,n,s,t),this}let f=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(f)<.001&&(f=1),this.x=(m-g)/f,this.y=(u-_)/f,this.z=(d-h)/f,this.w=Math.acos((c+p+y-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ra=class extends xi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ye(0,0,e,t),this.scissorTest=!1,this.viewport=new Ye(0,0,e,t);let n={width:e,height:t,depth:1};i.encoding!==void 0&&(Xn("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Bi?Je:Yt),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new It(n,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,t,i=1){this.width===e&&this.height===t&&this.depth===i||(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new es(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ai=class extends Ra{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},ts=class extends It{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=_t,this.minFilter=_t,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ca=class extends It{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=_t,this.minFilter=_t,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var st=class{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,s,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],u=i[n+3],d=s[a+0],p=s[a+1],g=s[a+2],_=s[a+3];if(o===0)return e[t+0]=l,e[t+1]=c,e[t+2]=h,void(e[t+3]=u);if(o===1)return e[t+0]=d,e[t+1]=p,e[t+2]=g,void(e[t+3]=_);if(u!==_||l!==d||c!==p||h!==g){let m=1-o,y=l*d+c*p+h*g+u*_,f=y>=0?1:-1,v=1-y*y;if(v>Number.EPSILON){let R=Math.sqrt(v),M=Math.atan2(R,y*f);m=Math.sin(m*M)/R,o=Math.sin(o*M)/R}let b=o*f;if(l=l*m+d*b,c=c*m+p*b,h=h*m+g*b,u=u*m+_*b,m===1-o){let R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,n,s,a){let o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],u=s[a],d=s[a+1],p=s[a+2],g=s[a+3];return e[t]=o*g+h*u+l*p-c*d,e[t+1]=l*g+h*d+c*u-o*p,e[t+2]=c*g+h*p+o*d-l*u,e[t+3]=h*g-o*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,n=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),u=o(s/2),d=l(i/2),p=l(n/2),g=l(s/2);switch(a){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],n=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-n)*p}else if(i>o&&i>u){let p=2*Math.sqrt(1+i-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(n+a)/p,this._z=(s+c)/p}else if(o>u){let p=2*Math.sqrt(1+o-i-u);this._w=(s-c)/p,this._x=(n+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-i-o);this._w=(a-n)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(rt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,n=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+n*c-s*l,this._y=n*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,n=this._y,s=this._z,a=this._w,o=a*e._w+i*e._x+n*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*n+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=n*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),n=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(n),i*Math.sin(s),i*Math.cos(s),t*Math.sin(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},w=class r{constructor(e=0,t=0,i=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Dl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Dl.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*n,this.y=s[1]*t+s[4]*i+s[7]*n,this.z=s[2]*t+s[5]*i+s[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,n=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,n=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*n-o*i),h=2*(o*t-s*n),u=2*(s*i-a*t);return this.x=t+l*c+a*u-o*h,this.y=i+l*h+o*c-s*u,this.z=n+l*u+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*n,this.y=s[1]*t+s[5]*i+s[9]*n,this.z=s[2]*t+s[6]*i+s[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,n=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return qs.copy(this).projectOnVector(e),this.sub(qs)}reflect(e){return this.sub(qs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(rt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,4*t)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,3*t)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=2*(Math.random()-.5),t=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},qs=new w,Dl=new st,Dt=class{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Gt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Gt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Gt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Gt):Gt.fromBufferAttribute(s,a),Gt.applyMatrix4(e.matrixWorld),this.expandByPoint(Gt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),gr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),gr.copy(i.boundingBox)),gr.applyMatrix4(e.matrixWorld),this.union(gr)}let n=e.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Gt),Gt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Hn),_r.subVectors(this.max,Hn),Ji.subVectors(e.a,Hn),Ki.subVectors(e.b,Hn),$i.subVectors(e.c,Hn),hi.subVectors(Ki,Ji),ui.subVectors($i,Ki),wi.subVectors(Ji,$i);let t=[0,-hi.z,hi.y,0,-ui.z,ui.y,0,-wi.z,wi.y,hi.z,0,-hi.x,ui.z,0,-ui.x,wi.z,0,-wi.x,-hi.y,hi.x,0,-ui.y,ui.x,0,-wi.y,wi.x,0];return!!Ys(t,Ji,Ki,$i,_r)&&(t=[1,0,0,0,1,0,0,0,1],!!Ys(t,Ji,Ki,$i,_r)&&(vr.crossVectors(hi,ui),t=[vr.x,vr.y,vr.z],Ys(t,Ji,Ki,$i,_r)))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Gt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(Gt).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Kt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Kt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Kt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Kt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Kt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Kt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Kt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Kt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Kt)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Kt=[new w,new w,new w,new w,new w,new w,new w,new w],Gt=new w,gr=new Dt,Ji=new w,Ki=new w,$i=new w,hi=new w,ui=new w,wi=new w,Hn=new w,_r=new w,vr=new w,Ai=new w;function Ys(r,e,t,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){Ai.fromArray(r,s);let o=n.x*Math.abs(Ai.x)+n.y*Math.abs(Ai.y)+n.z*Math.abs(Ai.z),l=e.dot(Ai),c=t.dot(Ai),h=i.dot(Ai);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Hh=new Dt,kn=new w,Zs=new w,Zt=class{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Hh.setFromPoints(e).getCenter(i);let n=0;for(let s=0,a=e.length;s<a;s++)n=Math.max(n,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;kn.subVectors(e,this.center);let t=kn.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),n=.5*(i-this.radius);this.center.addScaledVector(kn,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(kn.copy(e.center).add(Zs)),this.expandByPoint(kn.copy(e.center).sub(Zs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},$t=new w,Js=new w,yr=new w,di=new w,Ks=new w,xr=new w,$s=new w,vn=class{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$t)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=$t.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($t.copy(this.origin).addScaledVector(this.direction,t),$t.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){Js.copy(e).add(t).multiplyScalar(.5),yr.copy(t).sub(e).normalize(),di.copy(this.origin).sub(Js);let s=.5*e.distanceTo(t),a=-this.direction.dot(yr),o=di.dot(this.direction),l=-di.dot(yr),c=di.lengthSq(),h=Math.abs(1-a*a),u,d,p,g;if(h>0)if(u=a*l-o,d=a*o-l,g=s*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(u=Math.max(0,-(a*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),p=-u*u+d*(d+2*l)+c);else d=a>0?-s:s,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),n&&n.copy(Js).addScaledVector(yr,d),p}intersectSphere(e,t){$t.subVectors(e.center,this.origin);let i=$t.dot(this.direction),n=$t.dot($t)-i*i,s=e.radius*e.radius;if(n>s)return null;let a=Math.sqrt(s-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0?!0:e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,n=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,n=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||s>n?null:((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||o>n?null:((o>i||i!=i)&&(i=o),(l<n||n!=n)&&(n=l),n<0?null:this.at(i>=0?i:n,t)))}intersectsBox(e){return this.intersectBox(e,$t)!==null}intersectTriangle(e,t,i,n,s){Ks.subVectors(t,e),xr.subVectors(i,e),$s.crossVectors(Ks,xr);let a,o=this.direction.dot($s);if(o>0){if(n)return null;a=1}else{if(!(o<0))return null;a=-1,o=-o}di.subVectors(this.origin,e);let l=a*this.direction.dot(xr.crossVectors(di,xr));if(l<0)return null;let c=a*this.direction.dot(Ks.cross(di));if(c<0||l+c>o)return null;let h=-a*di.dot($s);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},we=class r{constructor(e,t,i,n,s,a,o,l,c,h,u,d,p,g,_,m){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,a,o,l,c,h,u,d,p,g,_,m)}set(e,t,i,n,s,a,o,l,c,h,u,d,p,g,_,m){let y=this.elements;return y[0]=e,y[4]=t,y[8]=i,y[12]=n,y[1]=s,y[5]=a,y[9]=o,y[13]=l,y[2]=c,y[6]=h,y[10]=u,y[14]=d,y[3]=p,y[7]=g,y[11]=_,y[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,n=1/Qi.setFromMatrixColumn(e,0).length(),s=1/Qi.setFromMatrixColumn(e,1).length(),a=1/Qi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,n=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=a*h,p=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+g*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,p=l*u,g=c*h,_=c*u;t[0]=d+_*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=p*o-g,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,p=l*u,g=c*h,_=c*u;t[0]=d-_*o,t[4]=-a*u,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,p=a*u,g=o*h,_=o*u;t[0]=l*h,t[4]=g*c-p,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-d*u,t[8]=g*u+p,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*u+g,t[10]=d-_*u}else if(e.order==="XZY"){let d=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=a*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(kh,e,Gh)}lookAt(e,t,i){let n=this.elements;return St.subVectors(e,t),St.lengthSq()===0&&(St.z=1),St.normalize(),pi.crossVectors(i,St),pi.lengthSq()===0&&(Math.abs(i.z)===1?St.x+=1e-4:St.z+=1e-4,St.normalize(),pi.crossVectors(i,St)),pi.normalize(),Mr.crossVectors(St,pi),n[0]=pi.x,n[4]=Mr.x,n[8]=St.x,n[1]=pi.y,n[5]=Mr.y,n[9]=St.y,n[2]=pi.z,n[6]=Mr.z,n[10]=St.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,n=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],p=i[13],g=i[2],_=i[6],m=i[10],y=i[14],f=i[3],v=i[7],b=i[11],R=i[15],M=n[0],A=n[4],U=n[8],P=n[12],B=n[1],G=n[5],x=n[9],I=n[13],L=n[2],F=n[6],ie=n[10],k=n[14],H=n[3],X=n[7],z=n[11],q=n[15];return s[0]=a*M+o*B+l*L+c*H,s[4]=a*A+o*G+l*F+c*X,s[8]=a*U+o*x+l*ie+c*z,s[12]=a*P+o*I+l*k+c*q,s[1]=h*M+u*B+d*L+p*H,s[5]=h*A+u*G+d*F+p*X,s[9]=h*U+u*x+d*ie+p*z,s[13]=h*P+u*I+d*k+p*q,s[2]=g*M+_*B+m*L+y*H,s[6]=g*A+_*G+m*F+y*X,s[10]=g*U+_*x+m*ie+y*z,s[14]=g*P+_*I+m*k+y*q,s[3]=f*M+v*B+b*L+R*H,s[7]=f*A+v*G+b*F+R*X,s[11]=f*U+v*x+b*ie+R*z,s[15]=f*P+v*I+b*k+R*q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],n=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14];return e[3]*(+s*l*u-n*c*u-s*o*d+i*c*d+n*o*p-i*l*p)+e[7]*(+t*l*p-t*c*d+s*a*d-n*a*p+n*c*h-s*l*h)+e[11]*(+t*c*u-t*o*p-s*a*u+i*a*p+s*o*h-i*c*h)+e[15]*(-n*o*h-t*l*u+t*o*d+n*a*u-i*a*d+i*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],g=e[12],_=e[13],m=e[14],y=e[15],f=u*m*c-_*d*c+_*l*p-o*m*p-u*l*y+o*d*y,v=g*d*c-h*m*c-g*l*p+a*m*p+h*l*y-a*d*y,b=h*_*c-g*u*c+g*o*p-a*_*p-h*o*y+a*u*y,R=g*u*l-h*_*l-g*o*d+a*_*d+h*o*m-a*u*m,M=t*f+i*v+n*b+s*R;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/M;return e[0]=f*A,e[1]=(_*d*s-u*m*s-_*n*p+i*m*p+u*n*y-i*d*y)*A,e[2]=(o*m*s-_*l*s+_*n*c-i*m*c-o*n*y+i*l*y)*A,e[3]=(u*l*s-o*d*s-u*n*c+i*d*c+o*n*p-i*l*p)*A,e[4]=v*A,e[5]=(h*m*s-g*d*s+g*n*p-t*m*p-h*n*y+t*d*y)*A,e[6]=(g*l*s-a*m*s-g*n*c+t*m*c+a*n*y-t*l*y)*A,e[7]=(a*d*s-h*l*s+h*n*c-t*d*c-a*n*p+t*l*p)*A,e[8]=b*A,e[9]=(g*u*s-h*_*s-g*i*p+t*_*p+h*i*y-t*u*y)*A,e[10]=(a*_*s-g*o*s+g*i*c-t*_*c-a*i*y+t*o*y)*A,e[11]=(h*o*s-a*u*s-h*i*c+t*u*c+a*i*p-t*o*p)*A,e[12]=R*A,e[13]=(h*_*n-g*u*n+g*i*d-t*_*d-h*i*m+t*u*m)*A,e[14]=(g*o*n-a*_*n-g*i*l+t*_*l+a*i*m-t*o*m)*A,e[15]=(a*u*n-h*o*n+h*i*l-t*u*l-a*i*d+t*o*d)*A,this}scale(e){let t=this.elements,i=e.x,n=e.y,s=e.z;return t[0]*=i,t[4]*=n,t[8]*=s,t[1]*=i,t[5]*=n,t[9]*=s,t[2]*=i,t[6]*=n,t[10]*=s,t[3]*=i,t[7]*=n,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),n=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,s,a){return this.set(1,i,s,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){let n=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,u=o+o,d=s*c,p=s*h,g=s*u,_=a*h,m=a*u,y=o*u,f=l*c,v=l*h,b=l*u,R=i.x,M=i.y,A=i.z;return n[0]=(1-(_+y))*R,n[1]=(p+b)*R,n[2]=(g-v)*R,n[3]=0,n[4]=(p-b)*M,n[5]=(1-(d+y))*M,n[6]=(m+f)*M,n[7]=0,n[8]=(g+v)*A,n[9]=(m-f)*A,n[10]=(1-(d+_))*A,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){let n=this.elements,s=Qi.set(n[0],n[1],n[2]).length(),a=Qi.set(n[4],n[5],n[6]).length(),o=Qi.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),e.x=n[12],e.y=n[13],e.z=n[14],Vt.copy(this);let l=1/s,c=1/a,h=1/o;return Vt.elements[0]*=l,Vt.elements[1]*=l,Vt.elements[2]*=l,Vt.elements[4]*=c,Vt.elements[5]*=c,Vt.elements[6]*=c,Vt.elements[8]*=h,Vt.elements[9]*=h,Vt.elements[10]*=h,t.setFromRotationMatrix(Vt),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,n,s,a,o=2e3){let l=this.elements,c=2*s/(t-e),h=2*s/(i-n),u=(t+e)/(t-e),d=(i+n)/(i-n),p,g;if(o===_n)p=-(a+s)/(a-s),g=-2*a*s/(a-s);else{if(o!==Kr)throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);p=-a/(a-s),g=-a*s/(a-s)}return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,n,s,a,o=2e3){let l=this.elements,c=1/(t-e),h=1/(i-n),u=1/(a-s),d=(t+e)*c,p=(i+n)*h,g,_;if(o===_n)g=(a+s)*u,_=-2*u;else{if(o!==Kr)throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);g=s*u,_=-1*u}return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},Qi=new w,Vt=new we,kh=new w(0,0,0),Gh=new w(1,1,1),pi=new w,Mr=new w,St=new w,Nl=new we,Ol=new st,yn=class r{constructor(e=0,t=0,i=0,n=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let n=e.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],u=n[2],d=n[6],p=n[10];switch(t){case"XYZ":this._y=Math.asin(rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-rt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(rt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-rt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(rt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-rt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Nl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Nl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ol.setFromEuler(this),this.setFromQuaternion(Ol,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};yn.DEFAULT_ORDER="XYZ";var is=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!=0}isEnabled(e){return(this.mask&(1<<e|0))!=0}},Vh=0,Fl=new w,en=new st,Qt=new we,Sr=new w,Gn=new w,Wh=new w,Xh=new st,Bl=new w(1,0,0),zl=new w(0,1,0),Hl=new w(0,0,1),jh={type:"added"},qh={type:"removed"},vt=class r extends xi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vh++}),this.uuid=Ln(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new w,t=new yn,i=new st,n=new w(1,1,1);t._onChange(function(){i.setFromEuler(t,!1)}),i._onChange(function(){t.setFromQuaternion(i,void 0,!1)}),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new we},normalMatrix:{value:new Re}}),this.matrix=new we,this.matrixWorld=new we,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new is,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return en.setFromAxisAngle(e,t),this.quaternion.multiply(en),this}rotateOnWorldAxis(e,t){return en.setFromAxisAngle(e,t),this.quaternion.premultiply(en),this}rotateX(e){return this.rotateOnAxis(Bl,e)}rotateY(e){return this.rotateOnAxis(zl,e)}rotateZ(e){return this.rotateOnAxis(Hl,e)}translateOnAxis(e,t){return Fl.copy(e).applyQuaternion(this.quaternion),this.position.add(Fl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Bl,e)}translateY(e){return this.translateOnAxis(zl,e)}translateZ(e){return this.translateOnAxis(Hl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Qt.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Sr.copy(e):Sr.set(e,t,i);let n=this.parent;this.updateWorldMatrix(!0,!1),Gn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Qt.lookAt(Gn,Sr,this.up):Qt.lookAt(Sr,Gn,this.up),this.quaternion.setFromRotationMatrix(Qt),n&&(Qt.extractRotation(n.matrixWorld),en.setFromRotationMatrix(Qt),this.quaternion.premultiply(en.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(jh)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(qh)),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Qt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Qt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Qt),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){let s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gn,e,Wh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gn,Xh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,n=t.length;i<n;i++){let s=t[i];s.matrixWorldAutoUpdate!==!0&&e!==!0||s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let n=this.children;for(let s=0,a=n.length;s<a;s++){let o=n[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let n={};function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.visibility=this._visibility,n.active=this._active,n.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),n.maxGeometryCount=this._maxGeometryCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.geometryCount=this._geometryCount,n.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(n.boundingSphere={center:n.boundingSphere.center.toArray(),radius:n.boundingSphere.radius}),this.boundingBox!==null&&(n.boundingBox={min:n.boundingBox.min.toArray(),max:n.boundingBox.max.toArray()})),this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));n.material=o}else n.material=s(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];n.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=n,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let n=e.children[i];this.add(n.clone())}return this}};vt.DEFAULT_UP=new w(0,1,0),vt.DEFAULT_MATRIX_AUTO_UPDATE=!0,vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Wt=new w,ei=new w,Qs=new w,ti=new w,tn=new w,nn=new w,kl=new w,ea=new w,ta=new w,ia=new w,br=!1,Di=class r{constructor(e=new w,t=new w,i=new w){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),Wt.subVectors(e,t),n.cross(Wt);let s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(e,t,i,n,s){Wt.subVectors(n,t),ei.subVectors(i,t),Qs.subVectors(e,t);let a=Wt.dot(Wt),o=Wt.dot(ei),l=Wt.dot(Qs),c=ei.dot(ei),h=ei.dot(Qs),u=a*c-o*o;if(u===0)return s.set(0,0,0),null;let d=1/u,p=(c*l-o*h)*d,g=(a*h-o*l)*d;return s.set(1-p-g,g,p)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,ti)!==null&&ti.x>=0&&ti.y>=0&&ti.x+ti.y<=1}static getUV(e,t,i,n,s,a,o,l){return br===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),br=!0),this.getInterpolation(e,t,i,n,s,a,o,l)}static getInterpolation(e,t,i,n,s,a,o,l){return this.getBarycoord(e,t,i,n,ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ti.x),l.addScaledVector(a,ti.y),l.addScaledVector(o,ti.z),l)}static isFrontFacing(e,t,i,n){return Wt.subVectors(i,t),ei.subVectors(e,t),Wt.cross(ei).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Wt.subVectors(this.c,this.b),ei.subVectors(this.a,this.b),.5*Wt.cross(ei).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,n,s){return br===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),br=!0),r.getInterpolation(e,this.a,this.b,this.c,t,i,n,s)}getInterpolation(e,t,i,n,s){return r.getInterpolation(e,this.a,this.b,this.c,t,i,n,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,n=this.b,s=this.c,a,o;tn.subVectors(n,i),nn.subVectors(s,i),ea.subVectors(e,i);let l=tn.dot(ea),c=nn.dot(ea);if(l<=0&&c<=0)return t.copy(i);ta.subVectors(e,n);let h=tn.dot(ta),u=nn.dot(ta);if(h>=0&&u<=h)return t.copy(n);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(tn,a);ia.subVectors(e,s);let p=tn.dot(ia),g=nn.dot(ia);if(g>=0&&p<=g)return t.copy(s);let _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(nn,o);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return kl.subVectors(s,n),o=(u-h)/(u-h+(p-g)),t.copy(n).addScaledVector(kl,o);let y=1/(m+_+d);return a=_*y,o=d*y,t.copy(i).addScaledVector(tn,a).addScaledVector(nn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Dc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mi={h:0,s:0,l:0},Er={h:0,s:0,l:0};function na(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+6*(e-r)*t:t<.5?e:t<2/3?r+6*(e-r)*(2/3-t):r}var Ie=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Je){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,Be.toWorkingColorSpace(this,t),this}setRGB(e,t,i,n=Be.workingColorSpace){return this.r=e,this.g=t,this.b=i,Be.toWorkingColorSpace(this,n),this}setHSL(e,t,i,n=Be.workingColorSpace){if(e=Nh(e,1),t=rt(t,0,1),i=rt(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=na(a,s,e+1/3),this.g=na(a,s,e),this.b=na(a,s,e-1/3)}return Be.toWorkingColorSpace(this,n),this}setStyle(e,t=Je){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Je){let i=Dc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=dn(e.r),this.g=dn(e.g),this.b=dn(e.b),this}copyLinearToSRGB(e){return this.r=Xs(e.r),this.g=Xs(e.g),this.b=Xs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Je){return Be.fromWorkingColorSpace(ut.copy(this),e),65536*Math.round(rt(255*ut.r,0,255))+256*Math.round(rt(255*ut.g,0,255))+Math.round(rt(255*ut.b,0,255))}getHexString(e=Je){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Be.workingColorSpace){Be.fromWorkingColorSpace(ut.copy(this),t);let i=ut.r,n=ut.g,s=ut.b,a=Math.max(i,n,s),o=Math.min(i,n,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(n-s)/u+(n<s?6:0);break;case n:l=(s-i)/u+2;break;case s:l=(i-n)/u+4}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Be.workingColorSpace){return Be.fromWorkingColorSpace(ut.copy(this),t),e.r=ut.r,e.g=ut.g,e.b=ut.b,e}getStyle(e=Je){Be.fromWorkingColorSpace(ut.copy(this),e);let t=ut.r,i=ut.g,n=ut.b;return e!==Je?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(255*t)},${Math.round(255*i)},${Math.round(255*n)})`}offsetHSL(e,t,i){return this.getHSL(mi),this.setHSL(mi.h+e,mi.s+t,mi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(mi),e.getHSL(Er);let i=Vs(mi.h,Er.h,t),n=Vs(mi.s,Er.s,t),s=Vs(mi.l,Er.l,t);return this.setHSL(i,n,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,n=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*n,this.g=s[1]*t+s[4]*i+s[7]*n,this.b=s[2]*t+s[5]*i+s[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ut=new Ie;Ie.NAMES=Dc;var Yh=0,zi=class extends xi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yh++}),this.uuid=Ln(),this.name="",this.type="Material",this.blending=1,this.side=yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ya,this.blendDst=xa,this.blendEquation=Pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ie(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yi,this.stencilZFail=Yi,this.stencilZPass=Yi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let n=this[t];n!==void 0?n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i:console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`)}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};function n(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(i.blending=this.blending),this.side!==yi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ya&&(i.blendSrc=this.blendSrc),this.blendDst!==xa&&(i.blendDst=this.blendDst),this.blendEquation!==Pi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Yi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Yi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData),t){let s=n(e.textures),a=n(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let n=t.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},xn=class extends zi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=bc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},gp=Zh();function Zh(){let r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),i=new Uint32Array(512),n=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(i[l]=0,i[256|l]=32768,n[l]=24,n[256|l]=24):c<-14?(i[l]=1024>>-c-14,i[256|l]=1024>>-c-14|32768,n[l]=-c-1,n[256|l]=-c-1):c<=15?(i[l]=c+15<<10,i[256|l]=c+15<<10|32768,n[l]=13,n[256|l]=13):c<128?(i[l]=31744,i[256|l]=64512,n[l]=24,n[256|l]=24):(i[l]=31744,i[256|l]=64512,n[l]=13,n[256|l]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(8388608&c);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:n,mantissaTable:s,exponentTable:a,offsetTable:o}}var qe=new w,Tr=new le,Ut=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Rl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=gi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Tr.fromBufferAttribute(this,t),Tr.applyMatrix3(e),this.setXY(t,Tr.x,Tr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)qe.fromBufferAttribute(this,t),qe.applyMatrix3(e),this.setXYZ(t,qe.x,qe.y,qe.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)qe.fromBufferAttribute(this,t),qe.applyMatrix4(e),this.setXYZ(t,qe.x,qe.y,qe.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)qe.fromBufferAttribute(this,t),qe.applyNormalMatrix(e),this.setXYZ(t,qe.x,qe.y,qe.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)qe.fromBufferAttribute(this,t),qe.transformDirection(e),this.setXYZ(t,qe.x,qe.y,qe.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=zn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=xt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=zn(t,this.array)),t}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=zn(t,this.array)),t}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=zn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=zn(t,this.array)),t}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),i=xt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),i=xt(i,this.array),n=xt(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),i=xt(i,this.array),n=xt(n,this.array),s=xt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Rl&&(e.usage=this.usage),e}};var Mn=class extends Ut{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Sn=class extends Ut{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var ve=class extends Ut{constructor(e,t,i){super(new Float32Array(e),t,i)}};var Jh=0,Lt=new we,ra=new vt,rn=new w,bt=new Dt,Vn=new Dt,tt=new w,Ge=class r extends xi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jh++}),this.uuid=Ln(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Uc(e)?Sn:Mn)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Re().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Lt.makeRotationFromQuaternion(e),this.applyMatrix4(Lt),this}rotateX(e){return Lt.makeRotationX(e),this.applyMatrix4(Lt),this}rotateY(e){return Lt.makeRotationY(e),this.applyMatrix4(Lt),this}rotateZ(e){return Lt.makeRotationZ(e),this.applyMatrix4(Lt),this}translate(e,t,i){return Lt.makeTranslation(e,t,i),this.applyMatrix4(Lt),this}scale(e,t,i){return Lt.makeScale(e,t,i),this.applyMatrix4(Lt),this}lookAt(e){return ra.lookAt(e),ra.updateMatrix(),this.applyMatrix4(ra.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rn).negate(),this.translate(rn.x,rn.y,rn.z),this}setFromPoints(e){let t=[];for(let i=0,n=e.length;i<n;i++){let s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new ve(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),void this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){let s=t[i];bt.setFromBufferAttribute(s),this.morphTargetsRelative?(tt.addVectors(this.boundingBox.min,bt.min),this.boundingBox.expandByPoint(tt),tt.addVectors(this.boundingBox.max,bt.max),this.boundingBox.expandByPoint(tt)):(this.boundingBox.expandByPoint(bt.min),this.boundingBox.expandByPoint(bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)return console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),void this.boundingSphere.set(new w,1/0);if(e){let i=this.boundingSphere.center;if(bt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];Vn.setFromBufferAttribute(o),this.morphTargetsRelative?(tt.addVectors(bt.min,Vn.min),bt.expandByPoint(tt),tt.addVectors(bt.max,Vn.max),bt.expandByPoint(tt)):(bt.expandByPoint(Vn.min),bt.expandByPoint(Vn.max))}bt.getCenter(i);let n=0;for(let s=0,a=e.count;s<a;s++)tt.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(tt));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)tt.fromBufferAttribute(o,c),l&&(rn.fromBufferAttribute(e,c),tt.add(rn)),n=Math.max(n,i.distanceToSquared(tt))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let i=e.array,n=t.position.array,s=t.normal.array,a=t.uv.array,o=n.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ut(new Float32Array(4*o),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let B=0;B<o;B++)c[B]=new w,h[B]=new w;let u=new w,d=new w,p=new w,g=new le,_=new le,m=new le,y=new w,f=new w;function v(B,G,x){u.fromArray(n,3*B),d.fromArray(n,3*G),p.fromArray(n,3*x),g.fromArray(a,2*B),_.fromArray(a,2*G),m.fromArray(a,2*x),d.sub(u),p.sub(u),_.sub(g),m.sub(g);let I=1/(_.x*m.y-m.x*_.y);isFinite(I)&&(y.copy(d).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(I),f.copy(p).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(I),c[B].add(y),c[G].add(y),c[x].add(y),h[B].add(f),h[G].add(f),h[x].add(f))}let b=this.groups;b.length===0&&(b=[{start:0,count:i.length}]);for(let B=0,G=b.length;B<G;++B){let x=b[B],I=x.start;for(let L=I,F=I+x.count;L<F;L+=3)v(i[L+0],i[L+1],i[L+2])}let R=new w,M=new w,A=new w,U=new w;function P(B){A.fromArray(s,3*B),U.copy(A);let G=c[B];R.copy(G),R.sub(A.multiplyScalar(A.dot(G))).normalize(),M.crossVectors(U,G);let x=M.dot(h[B])<0?-1:1;l[4*B]=R.x,l[4*B+1]=R.y,l[4*B+2]=R.z,l[4*B+3]=x}for(let B=0,G=b.length;B<G;++B){let x=b[B],I=x.start;for(let L=I,F=I+x.count;L<F;L+=3)P(i[L+0]),P(i[L+1]),P(i[L+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ut(new Float32Array(3*t.count),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let n=new w,s=new w,a=new w,o=new w,l=new w,c=new w,h=new w,u=new w;if(e)for(let d=0,p=e.count;d<p;d+=3){let g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);n.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),h.subVectors(a,s),u.subVectors(n,s),h.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)n.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),u.subVectors(n,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)tt.fromBufferAttribute(e,t),tt.normalize(),e.setXYZ(t,tt.x,tt.y,tt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),p=0,g=0;for(let _=0,m=l.length;_<m;_++){p=o.isInterleavedBufferAttribute?l[_]*o.data.stride+o.offset:l[_]*h;for(let y=0;y<h;y++)d[g++]=c[p++]}return new Ut(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,i=this.index.array,n=this.attributes;for(let o in n){let l=e(n[o],i);t.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){let d=e(c[h],i);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let n={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(n[l]=h,s=!0)}s&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone(t));let n=e.attributes;for(let c in n){let h=n[c];this.setAttribute(c,h.clone(t))}let s=e.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gl=new we,Ri=new vn,wr=new Zt,Vl=new w,sn=new w,an=new w,on=new w,sa=new w,Ar=new w,Rr=new le,Cr=new le,Lr=new le,Wl=new w,Xl=new w,jl=new w,Pr=new w,Ir=new w,Se=class extends vt{constructor(e=new Ge,t=new xn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,s=i.length;n<s;n++){let a=i[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}getVertexPosition(e,t){let i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);let o=this.morphTargetInfluences;if(s&&o){Ar.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],u=s[l];h!==0&&(sa.fromBufferAttribute(u,e),a?Ar.addScaledVector(sa,h):Ar.addScaledVector(sa.sub(t),h))}t.add(Ar)}return t}raycast(e,t){let i=this.geometry,n=this.material,s=this.matrixWorld;if(n!==void 0){if(i.boundingSphere===null&&i.computeBoundingSphere(),wr.copy(i.boundingSphere),wr.applyMatrix4(s),Ri.copy(e.ray).recast(e.near),wr.containsPoint(Ri.origin)===!1&&(Ri.intersectSphere(wr,Vl)===null||Ri.origin.distanceToSquared(Vl)>(e.far-e.near)**2))return;Gl.copy(s).invert(),Ri.copy(e.ray).applyMatrix4(Gl),i.boundingBox!==null&&Ri.intersectsBox(i.boundingBox)===!1||this._computeIntersections(e,t,Ri)}}_computeIntersections(e,t,i){let n,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],y=a[m.materialIndex];for(let f=Math.max(m.start,p.start),v=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));f<v;f+=3)n=Ur(this,y,e,i,c,h,u,o.getX(f),o.getX(f+1),o.getX(f+2)),n&&(n.faceIndex=Math.floor(f/3),n.face.materialIndex=m.materialIndex,t.push(n))}else for(let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);g<_;g+=3)n=Ur(this,a,e,i,c,h,u,o.getX(g),o.getX(g+1),o.getX(g+2)),n&&(n.faceIndex=Math.floor(g/3),t.push(n));else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],y=a[m.materialIndex];for(let f=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));f<v;f+=3)n=Ur(this,y,e,i,c,h,u,f,f+1,f+2),n&&(n.faceIndex=Math.floor(f/3),n.face.materialIndex=m.materialIndex,t.push(n))}else for(let g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);g<_;g+=3)n=Ur(this,a,e,i,c,h,u,g,g+1,g+2),n&&(n.faceIndex=Math.floor(g/3),t.push(n))}};function Ur(r,e,t,i,n,s,a,o,l,c){r.getVertexPosition(o,sn),r.getVertexPosition(l,an),r.getVertexPosition(c,on);let h=function(u,d,p,g,_,m,y,f){let v;if(v=d.side===dt?g.intersectTriangle(y,m,_,!0,f):g.intersectTriangle(_,m,y,d.side===yi,f),v===null)return null;Ir.copy(f),Ir.applyMatrix4(u.matrixWorld);let b=p.ray.origin.distanceTo(Ir);return b<p.near||b>p.far?null:{distance:b,point:Ir.clone(),object:u}}(r,e,t,i,sn,an,on,Pr);if(h){n&&(Rr.fromBufferAttribute(n,o),Cr.fromBufferAttribute(n,l),Lr.fromBufferAttribute(n,c),h.uv=Di.getInterpolation(Pr,sn,an,on,Rr,Cr,Lr,new le)),s&&(Rr.fromBufferAttribute(s,o),Cr.fromBufferAttribute(s,l),Lr.fromBufferAttribute(s,c),h.uv1=Di.getInterpolation(Pr,sn,an,on,Rr,Cr,Lr,new le),h.uv2=h.uv1),a&&(Wl.fromBufferAttribute(a,o),Xl.fromBufferAttribute(a,l),jl.fromBufferAttribute(a,c),h.normal=Di.getInterpolation(Pr,sn,an,on,Wl,Xl,jl,new w),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new w,materialIndex:0};Di.getNormal(sn,an,on,u.normal),h.face=u}return h}var at=class r extends Ge{constructor(e=1,t=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};let o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,p=0;function g(_,m,y,f,v,b,R,M,A,U,P){let B=b/A,G=R/U,x=b/2,I=R/2,L=M/2,F=A+1,ie=U+1,k=0,H=0,X=new w;for(let z=0;z<ie;z++){let q=z*G-I;for(let oe=0;oe<F;oe++){let E=oe*B-x;X[_]=E*f,X[m]=q*v,X[y]=L,c.push(X.x,X.y,X.z),X[_]=0,X[m]=0,X[y]=M>0?1:-1,h.push(X.x,X.y,X.z),u.push(oe/A),u.push(1-z/U),k+=1}}for(let z=0;z<U;z++)for(let q=0;q<A;q++){let oe=d+q+F*z,E=d+q+F*(z+1),T=d+(q+1)+F*(z+1),V=d+(q+1)+F*z;l.push(oe,E,V),l.push(E,T,V),H+=6}o.addGroup(p,H,P),p+=H,d+=k}g("z","y","x",-1,-1,i,t,e,a,s,0),g("z","y","x",1,-1,i,t,-e,a,s,1),g("x","z","y",1,1,e,i,t,n,a,2),g("x","z","y",1,-1,e,i,-t,n,a,3),g("x","y","z",1,-1,e,t,i,n,s,4),g("x","y","z",-1,-1,e,t,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new ve(c,3)),this.setAttribute("normal",new ve(h,3)),this.setAttribute("uv",new ve(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function bn(r){let e={};for(let t in r){e[t]={};for(let i in r[t]){let n=r[t][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone():Array.isArray(n)?e[t][i]=n.slice():e[t][i]=n}}return e}function gt(r){let e={};for(let t=0;t<r.length;t++){let i=bn(r[t]);for(let n in i)e[n]=i[n]}return e}function Nc(r){return r.getRenderTarget()===null?r.outputColorSpace:Be.workingColorSpace}var Kh={clone:bn,merge:gt},oi=class extends zi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,this.fragmentShader=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=bn(e.uniforms),this.uniformsGroups=function(t){let i=[];for(let n=0;n<t.length;n++)i.push(t[n].clone());return i}(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let s=this.uniforms[n].value;s&&s.isTexture?t.uniforms[n]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[n]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[n]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[n]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[n]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[n]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[n]={type:"m4",value:s.toArray()}:t.uniforms[n]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Kn=class extends vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new we,this.projectionMatrix=new we,this.projectionMatrixInverse=new we,this.coordinateSystem=_n}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Tt=class extends Kn{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=2*wa*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*Wr*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*wa*Math.atan(Math.tan(.5*Wr*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,n,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(.5*Wr*this.fov)/this.zoom,i=2*t,n=this.aspect*i,s=-.5*n,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*n/l,t-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ln=-90,La=class extends vt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let n=new Tt(ln,1,e,t);n.layers=this.layers,this.add(n);let s=new Tt(ln,1,e,t);s.layers=this.layers,this.add(s);let a=new Tt(ln,1,e,t);a.layers=this.layers,this.add(a);let o=new Tt(ln,1,e,t);o.layers=this.layers,this.add(o);let l=new Tt(ln,1,e,t);l.layers=this.layers,this.add(l);let c=new Tt(ln,1,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,n,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===_n)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else{if(e!==Kr)throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1)}for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,n),e.render(t,s),e.setRenderTarget(i,1,n),e.render(t,a),e.setRenderTarget(i,2,n),e.render(t,o),e.setRenderTarget(i,3,n),e.render(t,l),e.setRenderTarget(i,4,n),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,n),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},ns=class extends It{constructor(e,t,i,n,s,a,o,l,c,h){super(e=e!==void 0?e:[],t=t!==void 0?t:mn,i,n,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Pa=class extends ai{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];t.encoding!==void 0&&(Xn("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===Bi?Je:Yt),this.texture=new ns(n,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Et}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new at(5,5,5),s=new oi({name:"CubemapFromEquirect",uniforms:bn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:dt,blending:0});s.uniforms.tEquirect.value=t;let a=new Se(n,s),o=t.minFilter;return t.minFilter===Xr&&(t.minFilter=Et),new La(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,n){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(s)}},aa=new w,$h=new w,Qh=new Re,ni=class{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let n=aa.subVectors(i,t).cross($h.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(aa),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Qh.getNormalMatrix(e),n=this.coplanarPoint(aa).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ci=new Zt,Dr=new w,En=class{constructor(e=new ni,t=new ni,i=new ni,n=new ni,s=new ni,a=new ni){this.planes=[e,t,i,n,s,a]}set(e,t,i,n,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=2e3){let i=this.planes,n=e.elements,s=n[0],a=n[1],o=n[2],l=n[3],c=n[4],h=n[5],u=n[6],d=n[7],p=n[8],g=n[9],_=n[10],m=n[11],y=n[12],f=n[13],v=n[14],b=n[15];if(i[0].setComponents(l-s,d-c,m-p,b-y).normalize(),i[1].setComponents(l+s,d+c,m+p,b+y).normalize(),i[2].setComponents(l+a,d+h,m+g,b+f).normalize(),i[3].setComponents(l-a,d-h,m-g,b-f).normalize(),i[4].setComponents(l-o,d-u,m-_,b-v).normalize(),t===_n)i[5].setComponents(l+o,d+u,m+_,b+v).normalize();else{if(t!==Kr)throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);i[5].setComponents(o,u,_,v).normalize()}return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ci.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ci.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ci)}intersectsSprite(e){return Ci.center.set(0,0,0),Ci.radius=.7071067811865476,Ci.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ci)}intersectsSphere(e){let t=this.planes,i=e.center,n=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let n=t[i];if(Dr.x=n.normal.x>0?e.max.x:e.min.x,Dr.y=n.normal.y>0?e.max.y:e.min.y,Dr.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(Dr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Oc(){let r=null,e=!1,t=null,i=null;function n(s,a){t(s,a),i=r.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&(i=r.requestAnimationFrame(n),e=!0)},stop:function(){r.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function eu(r,e){let t=e.isWebGL2,i=new WeakMap;return{get:function(n){return n.isInterleavedBufferAttribute&&(n=n.data),i.get(n)},remove:function(n){n.isInterleavedBufferAttribute&&(n=n.data);let s=i.get(n);s&&(r.deleteBuffer(s.buffer),i.delete(n))},update:function(n,s){if(n.isGLBufferAttribute){let o=i.get(n);return void((!o||o.version<n.version)&&i.set(n,{buffer:n.buffer,type:n.type,bytesPerElement:n.elementSize,version:n.version}))}n.isInterleavedBufferAttribute&&(n=n.data);let a=i.get(n);if(a===void 0)i.set(n,function(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=r.createBuffer(),p;if(r.bindBuffer(l,d),r.bufferData(l,c,h),o.onUploadCallback(),c instanceof Float32Array)p=r.FLOAT;else if(c instanceof Uint16Array)if(o.isFloat16BufferAttribute){if(!t)throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");p=r.HALF_FLOAT}else p=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=r.SHORT;else if(c instanceof Uint32Array)p=r.UNSIGNED_INT;else if(c instanceof Int32Array)p=r.INT;else if(c instanceof Int8Array)p=r.BYTE;else if(c instanceof Uint8Array)p=r.UNSIGNED_BYTE;else{if(!(c instanceof Uint8ClampedArray))throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);p=r.UNSIGNED_BYTE}return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}(n,s));else if(a.version<n.version){if(a.size!==n.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");(function(o,l,c){let h=l.array,u=l._updateRange,d=l.updateRanges;if(r.bindBuffer(c,o),u.count===-1&&d.length===0&&r.bufferSubData(c,0,h),d.length!==0){for(let p=0,g=d.length;p<g;p++){let _=d[p];t?r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count):r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h.subarray(_.start,_.start+_.count))}l.clearUpdateRanges()}u.count!==-1&&(t?r.bufferSubData(c,u.offset*h.BYTES_PER_ELEMENT,h,u.offset,u.count):r.bufferSubData(c,u.offset*h.BYTES_PER_ELEMENT,h.subarray(u.offset,u.offset+u.count)),u.count=-1),l.onUploadCallback()})(a.buffer,n,s),a.version=n.version}}}}var rs=class r extends Ge{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};let s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,u=e/o,d=t/l,p=[],g=[],_=[],m=[];for(let y=0;y<h;y++){let f=y*d-a;for(let v=0;v<c;v++){let b=v*u-s;g.push(b,-f,0),_.push(0,0,1),m.push(v/o),m.push(1-y/l)}}for(let y=0;y<l;y++)for(let f=0;f<o;f++){let v=f+c*y,b=f+c*(y+1),R=f+1+c*(y+1),M=f+1+c*y;p.push(v,b,M),p.push(b,R,M)}this.setIndex(p),this.setAttribute("position",new ve(g,3)),this.setAttribute("normal",new ve(_,3)),this.setAttribute("uv",new ve(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},Ee={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:"gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment:`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_fragment:`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},ce={common:{diffuse:{value:new Ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Re},alphaMap:{value:null},alphaMapTransform:{value:new Re},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Re}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Re}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Re}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Re},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Re},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Re},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Re}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Re}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Re}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Re},alphaTest:{value:0},uvTransform:{value:new Re}},sprite:{diffuse:{value:new Ie(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Re},alphaMap:{value:null},alphaMapTransform:{value:new Re},alphaTest:{value:0}}},qt={basic:{uniforms:gt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Ee.meshbasic_vert,fragmentShader:Ee.meshbasic_frag},lambert:{uniforms:gt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Ie(0)}}]),vertexShader:Ee.meshlambert_vert,fragmentShader:Ee.meshlambert_frag},phong:{uniforms:gt([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Ie(0)},specular:{value:new Ie(1118481)},shininess:{value:30}}]),vertexShader:Ee.meshphong_vert,fragmentShader:Ee.meshphong_frag},standard:{uniforms:gt([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ee.meshphysical_vert,fragmentShader:Ee.meshphysical_frag},toon:{uniforms:gt([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Ie(0)}}]),vertexShader:Ee.meshtoon_vert,fragmentShader:Ee.meshtoon_frag},matcap:{uniforms:gt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Ee.meshmatcap_vert,fragmentShader:Ee.meshmatcap_frag},points:{uniforms:gt([ce.points,ce.fog]),vertexShader:Ee.points_vert,fragmentShader:Ee.points_frag},dashed:{uniforms:gt([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ee.linedashed_vert,fragmentShader:Ee.linedashed_frag},depth:{uniforms:gt([ce.common,ce.displacementmap]),vertexShader:Ee.depth_vert,fragmentShader:Ee.depth_frag},normal:{uniforms:gt([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Ee.meshnormal_vert,fragmentShader:Ee.meshnormal_frag},sprite:{uniforms:gt([ce.sprite,ce.fog]),vertexShader:Ee.sprite_vert,fragmentShader:Ee.sprite_frag},background:{uniforms:{uvTransform:{value:new Re},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ee.background_vert,fragmentShader:Ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ee.backgroundCube_vert,fragmentShader:Ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ee.cube_vert,fragmentShader:Ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ee.equirect_vert,fragmentShader:Ee.equirect_frag},distanceRGBA:{uniforms:gt([ce.common,ce.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ee.distanceRGBA_vert,fragmentShader:Ee.distanceRGBA_frag},shadow:{uniforms:gt([ce.lights,ce.fog,{color:{value:new Ie(0)},opacity:{value:1}}]),vertexShader:Ee.shadow_vert,fragmentShader:Ee.shadow_frag}};qt.physical={uniforms:gt([qt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Re},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Re},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Re},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Re},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Re},sheen:{value:0},sheenColor:{value:new Ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Re},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Re},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Re},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Re},attenuationDistance:{value:0},attenuationColor:{value:new Ie(0)},specularColor:{value:new Ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Re},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Re},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Re}}]),vertexShader:Ee.meshphysical_vert,fragmentShader:Ee.meshphysical_frag};var Nr={r:0,b:0,g:0};function tu(r,e,t,i,n,s,a){let o=new Ie(0),l,c,h=s===!0?0:1,u=null,d=0,p=null;function g(_,m){_.getRGB(Nr,Nc(r)),i.buffers.color.setClear(Nr.r,Nr.g,Nr.b,m,a)}return{getClearColor:function(){return o},setClearColor:function(_,m=1){o.set(_),h=m,g(o,h)},getClearAlpha:function(){return h},setClearAlpha:function(_){h=_,g(o,h)},render:function(_,m){let y=!1,f=m.isScene===!0?m.background:null;f&&f.isTexture&&(f=(m.backgroundBlurriness>0?t:e).get(f)),f===null?g(o,h):f&&f.isColor&&(g(f,1),y=!0);let v=r.xr.getEnvironmentBlendMode();v==="additive"?i.buffers.color.setClear(0,0,0,1,a):v==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||y)&&r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil),f&&(f.isCubeTexture||f.mapping===xs)?(c===void 0&&(c=new Se(new at(1,1,1),new oi({name:"BackgroundCubeMaterial",uniforms:bn(qt.backgroundCube.uniforms),vertexShader:qt.backgroundCube.vertexShader,fragmentShader:qt.backgroundCube.fragmentShader,side:dt,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,R,M){this.matrixWorld.copyPosition(M.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=f,c.material.uniforms.flipEnvMap.value=f.isCubeTexture&&f.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,c.material.toneMapped=Be.getTransfer(f.colorSpace)!==He,u===f&&d===f.version&&p===r.toneMapping||(c.material.needsUpdate=!0,u=f,d=f.version,p=r.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):f&&f.isTexture&&(l===void 0&&(l=new Se(new rs(2,2),new oi({name:"BackgroundMaterial",uniforms:bn(qt.background.uniforms),vertexShader:qt.background.vertexShader,fragmentShader:qt.background.fragmentShader,side:yi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=f,l.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,l.material.toneMapped=Be.getTransfer(f.colorSpace)!==He,f.matrixAutoUpdate===!0&&f.updateMatrix(),l.material.uniforms.uvTransform.value.copy(f.matrix),u===f&&d===f.version&&p===r.toneMapping||(l.material.needsUpdate=!0,u=f,d=f.version,p=r.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}}}function iu(r,e,t,i){let n=r.getParameter(r.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||s!==null,o={},l=p(null),c=l,h=!1;function u(R){return i.isWebGL2?r.bindVertexArray(R):s.bindVertexArrayOES(R)}function d(R){return i.isWebGL2?r.deleteVertexArray(R):s.deleteVertexArrayOES(R)}function p(R){let M=[],A=[],U=[];for(let P=0;P<n;P++)M[P]=0,A[P]=0,U[P]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:M,enabledAttributes:A,attributeDivisors:U,object:R,attributes:{},index:null}}function g(){let R=c.newAttributes;for(let M=0,A=R.length;M<A;M++)R[M]=0}function _(R){m(R,0)}function m(R,M){let A=c.newAttributes,U=c.enabledAttributes,P=c.attributeDivisors;A[R]=1,U[R]===0&&(r.enableVertexAttribArray(R),U[R]=1),P[R]!==M&&((i.isWebGL2?r:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,M),P[R]=M)}function y(){let R=c.newAttributes,M=c.enabledAttributes;for(let A=0,U=M.length;A<U;A++)M[A]!==R[A]&&(r.disableVertexAttribArray(A),M[A]=0)}function f(R,M,A,U,P,B,G){G===!0?r.vertexAttribIPointer(R,M,A,P,B):r.vertexAttribPointer(R,M,A,U,P,B)}function v(){b(),h=!0,c!==l&&(c=l,u(c.object))}function b(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:function(R,M,A,U,P){let B=!1;if(a){let G=function(x,I,L){let F=L.wireframe===!0,ie=o[x.id];ie===void 0&&(ie={},o[x.id]=ie);let k=ie[I.id];k===void 0&&(k={},ie[I.id]=k);let H=k[F];return H===void 0&&(H=p(i.isWebGL2?r.createVertexArray():s.createVertexArrayOES()),k[F]=H),H}(U,A,M);c!==G&&(c=G,u(c.object)),B=function(x,I,L,F){let ie=c.attributes,k=I.attributes,H=0,X=L.getAttributes();for(let z in X)if(X[z].location>=0){let q=ie[z],oe=k[z];if(oe===void 0&&(z==="instanceMatrix"&&x.instanceMatrix&&(oe=x.instanceMatrix),z==="instanceColor"&&x.instanceColor&&(oe=x.instanceColor)),q===void 0||q.attribute!==oe||oe&&q.data!==oe.data)return!0;H++}return c.attributesNum!==H||c.index!==F}(R,U,A,P),B&&function(x,I,L,F){let ie={},k=I.attributes,H=0,X=L.getAttributes();for(let z in X)if(X[z].location>=0){let q=k[z];q===void 0&&(z==="instanceMatrix"&&x.instanceMatrix&&(q=x.instanceMatrix),z==="instanceColor"&&x.instanceColor&&(q=x.instanceColor));let oe={};oe.attribute=q,q&&q.data&&(oe.data=q.data),ie[z]=oe,H++}c.attributes=ie,c.attributesNum=H,c.index=F}(R,U,A,P)}else{let G=M.wireframe===!0;c.geometry===U.id&&c.program===A.id&&c.wireframe===G||(c.geometry=U.id,c.program=A.id,c.wireframe=G,B=!0)}P!==null&&t.update(P,r.ELEMENT_ARRAY_BUFFER),(B||h)&&(h=!1,function(G,x,I,L){if(i.isWebGL2===!1&&(G.isInstancedMesh||L.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;g();let F=L.attributes,ie=I.getAttributes(),k=x.defaultAttributeValues;for(let H in ie){let X=ie[H];if(X.location>=0){let z=F[H];if(z===void 0&&(H==="instanceMatrix"&&G.instanceMatrix&&(z=G.instanceMatrix),H==="instanceColor"&&G.instanceColor&&(z=G.instanceColor)),z!==void 0){let q=z.normalized,oe=z.itemSize,E=t.get(z);if(E===void 0)continue;let T=E.buffer,V=E.type,Q=E.bytesPerElement,D=i.isWebGL2===!0&&(V===r.INT||V===r.UNSIGNED_INT||z.gpuType===Tc);if(z.isInterleavedBufferAttribute){let J=z.data,O=J.stride,N=z.offset;if(J.isInstancedInterleavedBuffer){for(let W=0;W<X.locationSize;W++)m(X.location+W,J.meshPerAttribute);G.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let W=0;W<X.locationSize;W++)_(X.location+W);r.bindBuffer(r.ARRAY_BUFFER,T);for(let W=0;W<X.locationSize;W++)f(X.location+W,oe/X.locationSize,V,q,O*Q,(N+oe/X.locationSize*W)*Q,D)}else{if(z.isInstancedBufferAttribute){for(let J=0;J<X.locationSize;J++)m(X.location+J,z.meshPerAttribute);G.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=z.meshPerAttribute*z.count)}else for(let J=0;J<X.locationSize;J++)_(X.location+J);r.bindBuffer(r.ARRAY_BUFFER,T);for(let J=0;J<X.locationSize;J++)f(X.location+J,oe/X.locationSize,V,q,oe*Q,oe/X.locationSize*J*Q,D)}}else if(k!==void 0){let q=k[H];if(q!==void 0)switch(q.length){case 2:r.vertexAttrib2fv(X.location,q);break;case 3:r.vertexAttrib3fv(X.location,q);break;case 4:r.vertexAttrib4fv(X.location,q);break;default:r.vertexAttrib1fv(X.location,q)}}}}y()}(R,M,A,U),P!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(P).buffer))},reset:v,resetDefaultState:b,dispose:function(){v();for(let R in o){let M=o[R];for(let A in M){let U=M[A];for(let P in U)d(U[P].object),delete U[P];delete M[A]}delete o[R]}},releaseStatesOfGeometry:function(R){if(o[R.id]===void 0)return;let M=o[R.id];for(let A in M){let U=M[A];for(let P in U)d(U[P].object),delete U[P];delete M[A]}delete o[R.id]},releaseStatesOfProgram:function(R){for(let M in o){let A=o[M];if(A[R.id]===void 0)continue;let U=A[R.id];for(let P in U)d(U[P].object),delete U[P];delete A[R.id]}},initAttributes:g,enableAttribute:_,disableUnusedAttributes:y}}function nu(r,e,t,i){let n=i.isWebGL2,s;this.setMode=function(a){s=a},this.render=function(a,o){r.drawArrays(s,a,o),t.update(o,s,1)},this.renderInstances=function(a,o,l){if(l===0)return;let c,h;if(n)c=r,h="drawArraysInstanced";else if(c=e.get("ANGLE_instanced_arrays"),h="drawArraysInstancedANGLE",c===null)return void console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");c[h](s,a,o,l),t.update(o,s,l)},this.renderMultiDraw=function(a,o,l){if(l===0)return;let c=e.get("WEBGL_multi_draw");if(c===null)for(let h=0;h<l;h++)this.render(a[h],o[h]);else{c.multiDrawArraysWEBGL(s,a,0,o,0,l);let h=0;for(let u=0;u<l;u++)h+=o[u];t.update(h,s,1)}}}function ru(r,e,t){let i;function n(b){if(b==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let s=typeof WebGL2RenderingContext<"u"&&r.constructor.name==="WebGL2RenderingContext",a=t.precision!==void 0?t.precision:"highp",o=n(a);o!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",o,"instead."),a=o);let l=s||e.has("WEBGL_draw_buffers"),c=t.logarithmicDepthBuffer===!0,h=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),u=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),_=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),m=r.getParameter(r.MAX_VARYING_VECTORS),y=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),f=u>0,v=s||e.has("OES_texture_float");return{isWebGL2:s,drawBuffers:l,getMaxAnisotropy:function(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let b=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i},getMaxPrecision:n,precision:a,logarithmicDepthBuffer:c,maxTextures:h,maxVertexTextures:u,maxTextureSize:d,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:_,maxVaryings:m,maxFragmentUniforms:y,vertexTextures:f,floatFragmentTextures:v,floatVertexTextures:f&&v,maxSamples:s?r.getParameter(r.MAX_SAMPLES):0}}function su(r){let e=this,t=null,i=0,n=!1,s=!1,a=new ni,o=new Re,l={value:null,needsUpdate:!1};function c(h,u,d,p){let g=h!==null?h.length:0,_=null;if(g!==0){if(_=l.value,p!==!0||_===null){let m=d+4*g,y=u.matrixWorldInverse;o.getNormalMatrix(y),(_===null||_.length<m)&&(_=new Float32Array(m));for(let f=0,v=d;f!==g;++f,v+=4)a.copy(h[f]).applyMatrix4(y,o),a.normal.toArray(_,v),_[v+3]=a.constant}l.value=_,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,_}this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){let d=h.length!==0||u||i!==0||n;return n=u,i=h.length,d},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,u){t=c(h,u,0)},this.setState=function(h,u,d){let p=h.clippingPlanes,g=h.clipIntersection,_=h.clipShadows,m=r.get(h);if(!n||p===null||p.length===0||s&&!_)s?c(null):function(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}();else{let y=s?0:i,f=4*y,v=m.clippingState||null;l.value=v,v=c(p,u,f,d);for(let b=0;b!==f;++b)v[b]=t[b];m.clippingState=v,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=y}}}function au(r){let e=new WeakMap;function t(n,s){return s===Ma?n.mapping=mn:s===Sa&&(n.mapping=fn),n}function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping;if(s===Ma||s===Sa){if(e.has(n))return t(e.get(n).texture,n.mapping);{let a=n.image;if(a&&a.height>0){let o=new Pa(a.height/2);return o.fromEquirectangularTexture(r,n),e.set(n,o),n.addEventListener("dispose",i),t(o.texture,n.mapping)}return null}}}return n},dispose:function(){e=new WeakMap}}}var Tn=class extends Kn{constructor(e=-1,t=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2,s=i-e,a=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ql=[.125,.215,.35,.446,.526,.582],Wn=20,oa=new Tn,Yl=new Ie,la=null,ca=0,ha=0,Li=(1+Math.sqrt(5))/2,cn=1/Li,Zl=[new w(1,1,1),new w(-1,1,1),new w(1,1,-1),new w(-1,1,-1),new w(0,Li,cn),new w(0,Li,-cn),new w(cn,0,Li),new w(-cn,0,Li),new w(Li,cn,0),new w(-Li,cn,0)],ss=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,n=100){la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,n,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$l(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(la,ca,ha),e.scissorTest=!1,Or(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===mn||e.mapping===fn?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel();let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Et,minFilter:Et,generateMipmaps:!1,type:Jn,format:Pt,colorSpace:si,depthBuffer:!1},n=Jl(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jl(e,t,i);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=function(a){let o=[],l=[],c=[],h=a,u=a-4+1+ql.length;for(let d=0;d<u;d++){let p=Math.pow(2,h);l.push(p);let g=1/p;d>a-4?g=ql[d-a+4-1]:d===0&&(g=0),c.push(g);let _=1/(p-2),m=-_,y=1+_,f=[m,m,y,m,y,y,m,m,y,y,m,y],v=6,b=6,R=3,M=2,A=1,U=new Float32Array(R*b*v),P=new Float32Array(M*b*v),B=new Float32Array(A*b*v);for(let x=0;x<v;x++){let I=x%3*2/3-1,L=x>2?0:-1,F=[I,L,0,I+2/3,L,0,I+2/3,L+1,0,I,L,0,I+2/3,L+1,0,I,L+1,0];U.set(F,R*b*x),P.set(f,M*b*x);let ie=[x,x,x,x,x,x];B.set(ie,A*b*x)}let G=new Ge;G.setAttribute("position",new Ut(U,R)),G.setAttribute("uv",new Ut(P,M)),G.setAttribute("faceIndex",new Ut(B,A)),o.push(G),h>4&&h--}return{lodPlanes:o,sizeLods:l,sigmas:c}}(s)),this._blurMaterial=function(a,o,l){let c=new Float32Array(Wn),h=new w(0,1,0);return new oi({name:"SphericalGaussianBlur",defines:{n:Wn,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:c},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:h}},vertexShader:So(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}(s,e,t)}return n}_compileMaterial(e){let t=new Se(this._lodPlanes[0],e);this._renderer.compile(t,oa)}_sceneToCubeUV(e,t,i,n){let s=new Tt(90,1,t,i),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor(Yl),l.toneMapping=_i,l.autoClear=!1;let u=new xn({name:"PMREM.Background",side:dt,depthWrite:!1,depthTest:!1}),d=new Se(new at,u),p=!1,g=e.background;g?g.isColor&&(u.color.copy(g),e.background=null,p=!0):(u.color.copy(Yl),p=!0);for(let _=0;_<6;_++){let m=_%3;m===0?(s.up.set(0,a[_],0),s.lookAt(o[_],0,0)):m===1?(s.up.set(0,0,a[_]),s.lookAt(0,o[_],0)):(s.up.set(0,a[_],0),s.lookAt(0,0,o[_]));let y=this._cubeSize;Or(n,m*y,_>2?y:0,y,y),l.setRenderTarget(n),p&&l.render(d,s),l.render(e,s)}d.geometry.dispose(),d.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=g}_textureToCubeUV(e,t){let i=this._renderer,n=e.mapping===mn||e.mapping===fn;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=$l()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kl());let s=n?this._cubemapMaterial:this._equirectMaterial,a=new Se(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let o=this._cubeSize;Or(t,0,0,3*o,2*o),i.setRenderTarget(t),i.render(a,oa)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let n=1;n<this._lodPlanes.length;n++){let s=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),a=Zl[(n-1)%Zl.length];this._blur(e,n-1,n,s,a)}t.autoClear=i}_blur(e,t,i,n,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,n,"latitudinal",s),this._halfBlur(a,e,i,i,n,"longitudinal",s)}_halfBlur(e,t,i,n,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=new Se(this._lodPlanes[n],c),u=c.uniforms,d=this._sizeLods[i]-1,p=isFinite(s)?Math.PI/(2*d):2*Math.PI/39,g=s/p,_=isFinite(s)?1+Math.floor(3*g):Wn;_>Wn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${_} samples when the maximum is set to 20`);let m=[],y=0;for(let b=0;b<Wn;++b){let R=b/g,M=Math.exp(-R*R/2);m.push(M),b===0?y+=M:b<_&&(y+=2*M)}for(let b=0;b<m.length;b++)m[b]=m[b]/y;u.envMap.value=e.texture,u.samples.value=_,u.weights.value=m,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:f}=this;u.dTheta.value=p,u.mipInt.value=f-i;let v=this._sizeLods[n];Or(t,3*v*(n>f-4?n-f+4:0),4*(this._cubeSize-v),3*v,2*v),l.setRenderTarget(t),l.render(h,oa)}};function Jl(r,e,t){let i=new ai(r,e,t);return i.texture.mapping=xs,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Or(r,e,t,i,n){r.viewport.set(e,t,i,n),r.scissor.set(e,t,i,n)}function Kl(){return new oi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:So(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function $l(){return new oi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:So(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function So(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ou(r){let e=new WeakMap,t=null;function i(n){let s=n.target;s.removeEventListener("dispose",i);let a=e.get(s);a!==void 0&&(e.delete(s),a.dispose())}return{get:function(n){if(n&&n.isTexture){let s=n.mapping,a=s===Ma||s===Sa,o=s===mn||s===fn;if(a||o){if(n.isRenderTargetTexture&&n.needsPMREMUpdate===!0){n.needsPMREMUpdate=!1;let l=e.get(n);return t===null&&(t=new ss(r)),l=a?t.fromEquirectangular(n,l):t.fromCubemap(n,l),e.set(n,l),l.texture}if(e.has(n))return e.get(n).texture;{let l=n.image;if(a&&l&&l.height>0||o&&l&&function(c){let h=0,u=6;for(let d=0;d<u;d++)c[d]!==void 0&&h++;return h===u}(l)){t===null&&(t=new ss(r));let c=a?t.fromEquirectangular(n):t.fromCubemap(n);return e.set(n,c),n.addEventListener("dispose",i),c.texture}return null}}}return n},dispose:function(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}}}function lu(r){let e={};function t(i){if(e[i]!==void 0)return e[i];let n;switch(i){case"WEBGL_depth_texture":n=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=r.getExtension(i)}return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){let n=t(i);return n===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function cu(r,e,t,i){let n={},s=new WeakMap;function a(l){let c=l.target;c.index!==null&&e.remove(c.index);for(let u in c.attributes)e.remove(c.attributes[u]);for(let u in c.morphAttributes){let d=c.morphAttributes[u];for(let p=0,g=d.length;p<g;p++)e.remove(d[p])}c.removeEventListener("dispose",a),delete n[c.id];let h=s.get(c);h&&(e.remove(h),s.delete(c)),i.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,t.memory.geometries--}function o(l){let c=[],h=l.index,u=l.attributes.position,d=0;if(h!==null){let _=h.array;d=h.version;for(let m=0,y=_.length;m<y;m+=3){let f=_[m+0],v=_[m+1],b=_[m+2];c.push(f,v,v,b,b,f)}}else{if(u===void 0)return;{let _=u.array;d=u.version;for(let m=0,y=_.length/3-1;m<y;m+=3){let f=m+0,v=m+1,b=m+2;c.push(f,v,v,b,b,f)}}}let p=new(Uc(c)?Sn:Mn)(c,1);p.version=d;let g=s.get(l);g&&e.remove(g),s.set(l,p)}return{get:function(l,c){return n[c.id]===!0||(c.addEventListener("dispose",a),n[c.id]=!0,t.memory.geometries++),c},update:function(l){let c=l.attributes;for(let u in c)e.update(c[u],r.ARRAY_BUFFER);let h=l.morphAttributes;for(let u in h){let d=h[u];for(let p=0,g=d.length;p<g;p++)e.update(d[p],r.ARRAY_BUFFER)}},getWireframeAttribute:function(l){let c=s.get(l);if(c){let h=l.index;h!==null&&c.version<h.version&&o(l)}else o(l);return s.get(l)}}}function hu(r,e,t,i){let n=i.isWebGL2,s,a,o;this.setMode=function(l){s=l},this.setIndex=function(l){a=l.type,o=l.bytesPerElement},this.render=function(l,c){r.drawElements(s,c,a,l*o),t.update(c,s,1)},this.renderInstances=function(l,c,h){if(h===0)return;let u,d;if(n)u=r,d="drawElementsInstanced";else if(u=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",u===null)return void console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");u[d](s,c,a,l*o,h),t.update(c,s,h)},this.renderMultiDraw=function(l,c,h){if(h===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let d=0;d<h;d++)this.render(l[d]/o,c[d]);else{u.multiDrawElementsWEBGL(s,c,0,a,l,0,h);let d=0;for(let p=0;p<h;p++)d+=c[p];t.update(d,s,1)}}}function uu(r){let e={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:e,programs:null,autoReset:!0,reset:function(){e.calls=0,e.triangles=0,e.points=0,e.lines=0},update:function(t,i,n){switch(e.calls++,i){case r.TRIANGLES:e.triangles+=n*(t/3);break;case r.LINES:e.lines+=n*(t/2);break;case r.LINE_STRIP:e.lines+=n*(t-1);break;case r.LINE_LOOP:e.lines+=n*t;break;case r.POINTS:e.points+=n*t;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",i)}}}}function du(r,e){return r[0]-e[0]}function pu(r,e){return Math.abs(e[1])-Math.abs(r[1])}function mu(r,e,t){let i={},n=new Float32Array(8),s=new WeakMap,a=new Ye,o=[];for(let l=0;l<8;l++)o[l]=[l,0];return{update:function(l,c,h){let u=l.morphTargetInfluences;if(e.isWebGL2===!0){let d=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,p=d!==void 0?d.length:0,g=s.get(c);if(g===void 0||g.count!==p){let I=function(){G.dispose(),s.delete(c),c.removeEventListener("dispose",I)};g!==void 0&&g.texture.dispose();let y=c.morphAttributes.position!==void 0,f=c.morphAttributes.normal!==void 0,v=c.morphAttributes.color!==void 0,b=c.morphAttributes.position||[],R=c.morphAttributes.normal||[],M=c.morphAttributes.color||[],A=0;y===!0&&(A=1),f===!0&&(A=2),v===!0&&(A=3);let U=c.attributes.position.count*A,P=1;U>e.maxTextureSize&&(P=Math.ceil(U/e.maxTextureSize),U=e.maxTextureSize);let B=new Float32Array(U*P*4*p),G=new ts(B,U,P,p);G.type=gi,G.needsUpdate=!0;let x=4*A;for(let L=0;L<p;L++){let F=b[L],ie=R[L],k=M[L],H=U*P*4*L;for(let X=0;X<F.count;X++){let z=X*x;y===!0&&(a.fromBufferAttribute(F,X),B[H+z+0]=a.x,B[H+z+1]=a.y,B[H+z+2]=a.z,B[H+z+3]=0),f===!0&&(a.fromBufferAttribute(ie,X),B[H+z+4]=a.x,B[H+z+5]=a.y,B[H+z+6]=a.z,B[H+z+7]=0),v===!0&&(a.fromBufferAttribute(k,X),B[H+z+8]=a.x,B[H+z+9]=a.y,B[H+z+10]=a.z,B[H+z+11]=k.itemSize===4?a.w:1)}}g={count:p,texture:G,size:new le(U,P)},s.set(c,g),c.addEventListener("dispose",I)}let _=0;for(let y=0;y<u.length;y++)_+=u[y];let m=c.morphTargetsRelative?1:1-_;h.getUniforms().setValue(r,"morphTargetBaseInfluence",m),h.getUniforms().setValue(r,"morphTargetInfluences",u),h.getUniforms().setValue(r,"morphTargetsTexture",g.texture,t),h.getUniforms().setValue(r,"morphTargetsTextureSize",g.size)}else{let d=u===void 0?0:u.length,p=i[c.id];if(p===void 0||p.length!==d){p=[];for(let f=0;f<d;f++)p[f]=[f,0];i[c.id]=p}for(let f=0;f<d;f++){let v=p[f];v[0]=f,v[1]=u[f]}p.sort(pu);for(let f=0;f<8;f++)f<d&&p[f][1]?(o[f][0]=p[f][0],o[f][1]=p[f][1]):(o[f][0]=Number.MAX_SAFE_INTEGER,o[f][1]=0);o.sort(du);let g=c.morphAttributes.position,_=c.morphAttributes.normal,m=0;for(let f=0;f<8;f++){let v=o[f],b=v[0],R=v[1];b!==Number.MAX_SAFE_INTEGER&&R?(g&&c.getAttribute("morphTarget"+f)!==g[b]&&c.setAttribute("morphTarget"+f,g[b]),_&&c.getAttribute("morphNormal"+f)!==_[b]&&c.setAttribute("morphNormal"+f,_[b]),n[f]=R,m+=R):(g&&c.hasAttribute("morphTarget"+f)===!0&&c.deleteAttribute("morphTarget"+f),_&&c.hasAttribute("morphNormal"+f)===!0&&c.deleteAttribute("morphNormal"+f),n[f]=0)}let y=c.morphTargetsRelative?1:1-m;h.getUniforms().setValue(r,"morphTargetBaseInfluence",y),h.getUniforms().setValue(r,"morphTargetInfluences",n)}}}}function fu(r,e,t,i){let n=new WeakMap;function s(a){let o=a.target;o.removeEventListener("dispose",s),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:function(a){let o=i.render.frame,l=a.geometry,c=e.get(a,l);if(n.get(c)!==o&&(e.update(c),n.set(c,o)),a.isInstancedMesh&&(a.hasEventListener("dispose",s)===!1&&a.addEventListener("dispose",s),n.get(a)!==o&&(t.update(a.instanceMatrix,r.ARRAY_BUFFER),a.instanceColor!==null&&t.update(a.instanceColor,r.ARRAY_BUFFER),n.set(a,o))),a.isSkinnedMesh){let h=a.skeleton;n.get(h)!==o&&(h.update(),n.set(h,o))}return c},dispose:function(){n=new WeakMap}}}var as=class extends It{constructor(e,t,i,n,s,a,o,l,c,h){if((h=h!==void 0?h:Fi)!==Fi&&h!==gn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Fi&&(i=fi),i===void 0&&h===gn&&(i=Oi),super(null,n,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:_t,this.minFilter=l!==void 0?l:_t,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Fc=new It,Bc=new as(1,1);Bc.compareFunction=515;var zc=new ts,Hc=new Ca,kc=new ns,Ql=[],ec=[],tc=new Float32Array(16),ic=new Float32Array(9),nc=new Float32Array(4);function Pn(r,e,t){let i=r[0];if(i<=0||i>0)return r;let n=e*t,s=Ql[n];if(s===void 0&&(s=new Float32Array(n),Ql[n]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function $e(r,e){if(r.length!==e.length)return!1;for(let t=0,i=r.length;t<i;t++)if(r[t]!==e[t])return!1;return!0}function Qe(r,e){for(let t=0,i=e.length;t<i;t++)r[t]=e[t]}function Ss(r,e){let t=ec[e];t===void 0&&(t=new Int32Array(e),ec[e]=t);for(let i=0;i!==e;++i)t[i]=r.allocateTextureUnit();return t}function gu(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function _u(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($e(t,e))return;r.uniform2fv(this.addr,e),Qe(t,e)}}function vu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)t[0]===e.r&&t[1]===e.g&&t[2]===e.b||(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if($e(t,e))return;r.uniform3fv(this.addr,e),Qe(t,e)}}function yu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($e(t,e))return;r.uniform4fv(this.addr,e),Qe(t,e)}}function xu(r,e){let t=this.cache,i=e.elements;if(i===void 0){if($e(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Qe(t,e)}else{if($e(t,i))return;nc.set(i),r.uniformMatrix2fv(this.addr,!1,nc),Qe(t,i)}}function Mu(r,e){let t=this.cache,i=e.elements;if(i===void 0){if($e(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Qe(t,e)}else{if($e(t,i))return;ic.set(i),r.uniformMatrix3fv(this.addr,!1,ic),Qe(t,i)}}function Su(r,e){let t=this.cache,i=e.elements;if(i===void 0){if($e(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Qe(t,e)}else{if($e(t,i))return;tc.set(i),r.uniformMatrix4fv(this.addr,!1,tc),Qe(t,i)}}function bu(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Eu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($e(t,e))return;r.uniform2iv(this.addr,e),Qe(t,e)}}function Tu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($e(t,e))return;r.uniform3iv(this.addr,e),Qe(t,e)}}function wu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($e(t,e))return;r.uniform4iv(this.addr,e),Qe(t,e)}}function Au(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Ru(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y||(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($e(t,e))return;r.uniform2uiv(this.addr,e),Qe(t,e)}}function Cu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z||(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($e(t,e))return;r.uniform3uiv(this.addr,e),Qe(t,e)}}function Lu(r,e){let t=this.cache;if(e.x!==void 0)t[0]===e.x&&t[1]===e.y&&t[2]===e.z&&t[3]===e.w||(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($e(t,e))return;r.uniform4uiv(this.addr,e),Qe(t,e)}}function Pu(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n);let s=this.type===r.SAMPLER_2D_SHADOW?Bc:Fc;t.setTexture2D(e||s,n)}function Iu(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||Hc,n)}function Uu(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||kc,n)}function Du(r,e,t){let i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||zc,n)}function Nu(r,e){r.uniform1fv(this.addr,e)}function Ou(r,e){let t=Pn(e,this.size,2);r.uniform2fv(this.addr,t)}function Fu(r,e){let t=Pn(e,this.size,3);r.uniform3fv(this.addr,t)}function Bu(r,e){let t=Pn(e,this.size,4);r.uniform4fv(this.addr,t)}function zu(r,e){let t=Pn(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Hu(r,e){let t=Pn(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function ku(r,e){let t=Pn(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Gu(r,e){r.uniform1iv(this.addr,e)}function Vu(r,e){r.uniform2iv(this.addr,e)}function Wu(r,e){r.uniform3iv(this.addr,e)}function Xu(r,e){r.uniform4iv(this.addr,e)}function ju(r,e){r.uniform1uiv(this.addr,e)}function qu(r,e){r.uniform2uiv(this.addr,e)}function Yu(r,e){r.uniform3uiv(this.addr,e)}function Zu(r,e){r.uniform4uiv(this.addr,e)}function Ju(r,e,t){let i=this.cache,n=e.length,s=Ss(t,n);$e(i,s)||(r.uniform1iv(this.addr,s),Qe(i,s));for(let a=0;a!==n;++a)t.setTexture2D(e[a]||Fc,s[a])}function Ku(r,e,t){let i=this.cache,n=e.length,s=Ss(t,n);$e(i,s)||(r.uniform1iv(this.addr,s),Qe(i,s));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||Hc,s[a])}function $u(r,e,t){let i=this.cache,n=e.length,s=Ss(t,n);$e(i,s)||(r.uniform1iv(this.addr,s),Qe(i,s));for(let a=0;a!==n;++a)t.setTextureCube(e[a]||kc,s[a])}function Qu(r,e,t){let i=this.cache,n=e.length,s=Ss(t,n);$e(i,s)||(r.uniform1iv(this.addr,s),Qe(i,s));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||zc,s[a])}var Ia=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=function(n){switch(n){case 5126:return gu;case 35664:return _u;case 35665:return vu;case 35666:return yu;case 35674:return xu;case 35675:return Mu;case 35676:return Su;case 5124:case 35670:return bu;case 35667:case 35671:return Eu;case 35668:case 35672:return Tu;case 35669:case 35673:return wu;case 5125:return Au;case 36294:return Ru;case 36295:return Cu;case 36296:return Lu;case 35678:case 36198:case 36298:case 36306:case 35682:return Pu;case 35679:case 36299:case 36307:return Iu;case 35680:case 36300:case 36308:case 36293:return Uu;case 36289:case 36303:case 36311:case 36292:return Du}}(t.type)}},Ua=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=function(n){switch(n){case 5126:return Nu;case 35664:return Ou;case 35665:return Fu;case 35666:return Bu;case 35674:return zu;case 35675:return Hu;case 35676:return ku;case 5124:case 35670:return Gu;case 35667:case 35671:return Vu;case 35668:case 35672:return Wu;case 35669:case 35673:return Xu;case 5125:return ju;case 36294:return qu;case 36295:return Yu;case 36296:return Zu;case 35678:case 36198:case 36298:case 36306:case 35682:return Ju;case 35679:case 36299:case 36307:return Ku;case 35680:case 36300:case 36308:case 36293:return $u;case 36289:case 36303:case 36311:case 36292:return Qu}}(t.type)}},Da=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let n=this.seq;for(let s=0,a=n.length;s!==a;++s){let o=n[s];o.setValue(e,t[o.id],i)}}},ua=/(\w+)(\])?(\[|\.)?/g;function rc(r,e){r.seq.push(e),r.map[e.id]=e}function ed(r,e,t){let i=r.name,n=i.length;for(ua.lastIndex=0;;){let s=ua.exec(i),a=ua.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o|=0),c===void 0||c==="["&&a+2===n){rc(t,c===void 0?new Ia(o,r,e):new Ua(o,r,e));break}{let h=t.map[o];h===void 0&&(h=new Da(o),rc(t,h)),t=h}}}var pn=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){let s=e.getActiveUniform(t,n);ed(s,e.getUniformLocation(t,s.name),this)}}setValue(e,t,i,n){let s=this.map[t];s!==void 0&&s.setValue(e,i,n)}setOptional(e,t,i){let n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){let i=[];for(let n=0,s=e.length;n!==s;++n){let a=e[n];a.id in t&&i.push(a)}return i}};function sc(r,e,t){let i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),i}var td=37297,id=0;function ac(r,e,t){let i=r.getShaderParameter(e,r.COMPILE_STATUS),n=r.getShaderInfoLog(e).trim();if(i&&n==="")return"";let s=/ERROR: 0:(\d+)/.exec(n);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+n+`

`+function(o,l){let c=o.split(`
`),h=[],u=Math.max(l-6,0),d=Math.min(l+6,c.length);for(let p=u;p<d;p++){let g=p+1;h.push(`${g===l?">":" "} ${g}: ${c[p]}`)}return h.join(`
`)}(r.getShaderSource(e),a)}return n}function nd(r,e){let t=function(i){let n=Be.getPrimaries(Be.workingColorSpace),s=Be.getPrimaries(i),a;switch(n===s?a="":n===Jr&&s===Zr?a="LinearDisplayP3ToLinearSRGB":n===Zr&&s===Jr&&(a="LinearSRGBToLinearDisplayP3"),i){case si:case Ms:return[a,"LinearTransferOETF"];case Je:case Mo:return[a,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[a,"LinearTransferOETF"]}}(e);return`vec4 ${r}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function rd(r,e){let t;switch(e){case Ch:t="Linear";break;case Lh:t="Reinhard";break;case Ph:t="OptimizedCineon";break;case yo:t="ACESFilmic";break;case Uh:t="AgX";break;case Ih:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function hn(r){return r!==""}function oc(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function lc(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var sd=/^[ \t]*#include +<([\w\d./]+)>/gm;function Na(r){return r.replace(sd,od)}var ad=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function od(r,e){let t=Ee[e];if(t===void 0){let i=ad.get(e);if(i===void 0)throw new Error("Can not resolve #include <"+e+">");t=Ee[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i)}return Na(t)}var ld=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cc(r){return r.replace(ld,cd)}function cd(r,e,t,i){let n="";for(let s=parseInt(e);s<parseInt(t);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function hc(r){let e="precision "+r.precision+` float;
precision `+r.precision+" int;";return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function hd(r,e,t,i){let n=r.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=function(x){let I="SHADOWMAP_TYPE_BASIC";return x.shadowMapType===Sc?I="SHADOWMAP_TYPE_PCF":x.shadowMapType===wh?I="SHADOWMAP_TYPE_PCF_SOFT":x.shadowMapType===ii&&(I="SHADOWMAP_TYPE_VSM"),I}(t),c=function(x){let I="ENVMAP_TYPE_CUBE";if(x.envMap)switch(x.envMapMode){case mn:case fn:I="ENVMAP_TYPE_CUBE";break;case xs:I="ENVMAP_TYPE_CUBE_UV"}return I}(t),h=function(x){let I="ENVMAP_MODE_REFLECTION";return x.envMap&&x.envMapMode===fn&&(I="ENVMAP_MODE_REFRACTION"),I}(t),u=function(x){let I="ENVMAP_BLENDING_NONE";if(x.envMap)switch(x.combine){case bc:I="ENVMAP_BLENDING_MULTIPLY";break;case Ah:I="ENVMAP_BLENDING_MIX";break;case Rh:I="ENVMAP_BLENDING_ADD"}return I}(t),d=function(x){let I=x.envMapCubeUVHeight;if(I===null)return null;let L=Math.log2(I)-2,F=1/I;return{texelWidth:1/(3*Math.max(Math.pow(2,L),112)),texelHeight:F,maxMip:L}}(t),p=t.isWebGL2?"":function(x){return[x.extensionDerivatives||x.envMapCubeUVHeight||x.bumpMap||x.normalMapTangentSpace||x.clearcoatNormalMap||x.flatShading||x.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(x.extensionFragDepth||x.logarithmicDepthBuffer)&&x.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",x.extensionDrawBuffers&&x.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(x.extensionShaderTextureLOD||x.envMap||x.transmission)&&x.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(hn).join(`
`)}(t),g=function(x){return[x.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(hn).join(`
`)}(t),_=function(x){let I=[];for(let L in x){let F=x[L];F!==!1&&I.push("#define "+L+" "+F)}return I.join(`
`)}(s),m=n.createProgram(),y,f,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(hn).join(`
`),y.length>0&&(y+=`
`),f=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(hn).join(`
`),f.length>0&&(f+=`
`)):(y=[hc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hn).join(`
`),f=[p,hc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==_i?"#define TONE_MAPPING":"",t.toneMapping!==_i?Ee.tonemapping_pars_fragment:"",t.toneMapping!==_i?rd("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ee.colorspace_pars_fragment,nd("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(hn).join(`
`)),a=Na(a),a=oc(a,t),a=lc(a,t),o=Na(o),o=oc(o,t),o=lc(o,t),a=cc(a),o=cc(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,y=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,f=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===Cl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Cl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let b=v+y+a,R=v+f+o,M=sc(n,n.VERTEX_SHADER,b),A=sc(n,n.FRAGMENT_SHADER,R);function U(x){if(r.debug.checkShaderErrors){let I=n.getProgramInfoLog(m).trim(),L=n.getShaderInfoLog(M).trim(),F=n.getShaderInfoLog(A).trim(),ie=!0,k=!0;if(n.getProgramParameter(m,n.LINK_STATUS)===!1)if(ie=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,m,M,A);else{let H=ac(n,M,"vertex"),X=ac(n,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(m,n.VALIDATE_STATUS)+`

Program Info Log: `+I+`
`+H+`
`+X)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):L!==""&&F!==""||(k=!1);k&&(x.diagnostics={runnable:ie,programLog:I,vertexShader:{log:L,prefix:y},fragmentShader:{log:F,prefix:f}})}n.deleteShader(M),n.deleteShader(A),P=new pn(n,m),B=function(I,L){let F={},ie=I.getProgramParameter(L,I.ACTIVE_ATTRIBUTES);for(let k=0;k<ie;k++){let H=I.getActiveAttrib(L,k),X=H.name,z=1;H.type===I.FLOAT_MAT2&&(z=2),H.type===I.FLOAT_MAT3&&(z=3),H.type===I.FLOAT_MAT4&&(z=4),F[X]={type:H.type,location:I.getAttribLocation(L,X),locationSize:z}}return F}(n,m)}let P,B;n.attachShader(m,M),n.attachShader(m,A),t.index0AttributeName!==void 0?n.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(m,0,"position"),n.linkProgram(m),this.getUniforms=function(){return P===void 0&&U(this),P},this.getAttributes=function(){return B===void 0&&U(this),B};let G=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return G===!1&&(G=n.getProgramParameter(m,td)),G},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=id++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=M,this.fragmentShader=A,this}var ud=0,Oa=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Fa(e),t.set(e,i)),i}},Fa=class{constructor(e){this.id=ud++,this.code=e,this.usedTimes=0}};function dd(r,e,t,i,n,s,a){let o=new is,l=new Oa,c=[],h=n.isWebGL2,u=n.logarithmicDepthBuffer,d=n.vertexTextures,p=n.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(m){return m===0?"uv":`uv${m}`}return{getParameters:function(m,y,f,v,b){let R=v.fog,M=b.geometry,A=m.isMeshStandardMaterial?v.environment:null,U=(m.isMeshStandardMaterial?t:e).get(m.envMap||A),P=U&&U.mapping===xs?U.image.height:null,B=g[m.type];m.precision!==null&&(p=n.getMaxPrecision(m.precision),p!==m.precision&&console.warn("THREE.WebGLProgram.getParameters:",m.precision,"not supported, using",p,"instead."));let G=M.morphAttributes.position||M.morphAttributes.normal||M.morphAttributes.color,x=G!==void 0?G.length:0,I,L,F,ie,k=0;if(M.morphAttributes.position!==void 0&&(k=1),M.morphAttributes.normal!==void 0&&(k=2),M.morphAttributes.color!==void 0&&(k=3),B){let lt=qt[B];I=lt.vertexShader,L=lt.fragmentShader}else I=m.vertexShader,L=m.fragmentShader,l.update(m),F=l.getVertexShaderID(m),ie=l.getFragmentShaderID(m);let H=r.getRenderTarget(),X=b.isInstancedMesh===!0,z=b.isBatchedMesh===!0,q=!!m.map,oe=!!m.matcap,E=!!U,T=!!m.aoMap,V=!!m.lightMap,Q=!!m.bumpMap,D=!!m.normalMap,J=!!m.displacementMap,O=!!m.emissiveMap,N=!!m.metalnessMap,W=!!m.roughnessMap,ee=m.anisotropy>0,$=m.clearcoat>0,S=m.iridescence>0,re=m.sheen>0,j=m.transmission>0,Y=ee&&!!m.anisotropyMap,se=$&&!!m.clearcoatMap,ue=$&&!!m.clearcoatNormalMap,pe=$&&!!m.clearcoatRoughnessMap,me=S&&!!m.iridescenceMap,Me=S&&!!m.iridescenceThicknessMap,fe=re&&!!m.sheenColorMap,ge=re&&!!m.sheenRoughnessMap,Te=!!m.specularMap,et=!!m.specularColorMap,_e=!!m.specularIntensityMap,Ne=j&&!!m.transmissionMap,Le=j&&!!m.thicknessMap,cr=!!m.gradientMap,ji=!!m.alphaMap,hr=m.alphaTest>0,At=!!m.alphaHash,Mt=!!m.extensions,qi=!!M.attributes.uv1,K=!!M.attributes.uv2,ur=!!M.attributes.uv3,On=_i;return m.toneMapped&&(H!==null&&H.isXRRenderTarget!==!0||(On=r.toneMapping)),{isWebGL2:h,shaderID:B,shaderType:m.type,shaderName:m.name,vertexShader:I,fragmentShader:L,defines:m.defines,customVertexShaderID:F,customFragmentShaderID:ie,isRawShaderMaterial:m.isRawShaderMaterial===!0,glslVersion:m.glslVersion,precision:p,batching:z,instancing:X,instancingColor:X&&b.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:H===null?r.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:si,map:q,matcap:oe,envMap:E,envMapMode:E&&U.mapping,envMapCubeUVHeight:P,aoMap:T,lightMap:V,bumpMap:Q,normalMap:D,displacementMap:d&&J,emissiveMap:O,normalMapObjectSpace:D&&m.normalMapType===1,normalMapTangentSpace:D&&m.normalMapType===0,metalnessMap:N,roughnessMap:W,anisotropy:ee,anisotropyMap:Y,clearcoat:$,clearcoatMap:se,clearcoatNormalMap:ue,clearcoatRoughnessMap:pe,iridescence:S,iridescenceMap:me,iridescenceThicknessMap:Me,sheen:re,sheenColorMap:fe,sheenRoughnessMap:ge,specularMap:Te,specularColorMap:et,specularIntensityMap:_e,transmission:j,transmissionMap:Ne,thicknessMap:Le,gradientMap:cr,opaque:m.transparent===!1&&m.blending===1,alphaMap:ji,alphaTest:hr,alphaHash:At,combine:m.combine,mapUv:q&&_(m.map.channel),aoMapUv:T&&_(m.aoMap.channel),lightMapUv:V&&_(m.lightMap.channel),bumpMapUv:Q&&_(m.bumpMap.channel),normalMapUv:D&&_(m.normalMap.channel),displacementMapUv:J&&_(m.displacementMap.channel),emissiveMapUv:O&&_(m.emissiveMap.channel),metalnessMapUv:N&&_(m.metalnessMap.channel),roughnessMapUv:W&&_(m.roughnessMap.channel),anisotropyMapUv:Y&&_(m.anisotropyMap.channel),clearcoatMapUv:se&&_(m.clearcoatMap.channel),clearcoatNormalMapUv:ue&&_(m.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pe&&_(m.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&_(m.iridescenceMap.channel),iridescenceThicknessMapUv:Me&&_(m.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&_(m.sheenColorMap.channel),sheenRoughnessMapUv:ge&&_(m.sheenRoughnessMap.channel),specularMapUv:Te&&_(m.specularMap.channel),specularColorMapUv:et&&_(m.specularColorMap.channel),specularIntensityMapUv:_e&&_(m.specularIntensityMap.channel),transmissionMapUv:Ne&&_(m.transmissionMap.channel),thicknessMapUv:Le&&_(m.thicknessMap.channel),alphaMapUv:ji&&_(m.alphaMap.channel),vertexTangents:!!M.attributes.tangent&&(D||ee),vertexColors:m.vertexColors,vertexAlphas:m.vertexColors===!0&&!!M.attributes.color&&M.attributes.color.itemSize===4,vertexUv1s:qi,vertexUv2s:K,vertexUv3s:ur,pointsUvs:b.isPoints===!0&&!!M.attributes.uv&&(q||ji),fog:!!R,useFog:m.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:m.flatShading===!0,sizeAttenuation:m.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:b.isSkinnedMesh===!0,morphTargets:M.morphAttributes.position!==void 0,morphNormals:M.morphAttributes.normal!==void 0,morphColors:M.morphAttributes.color!==void 0,morphTargetsCount:x,morphTextureStride:k,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:m.dithering,shadowMapEnabled:r.shadowMap.enabled&&f.length>0,shadowMapType:r.shadowMap.type,toneMapping:On,useLegacyLights:r._useLegacyLights,decodeVideoTexture:q&&m.map.isVideoTexture===!0&&Be.getTransfer(m.map.colorSpace)===He,premultipliedAlpha:m.premultipliedAlpha,doubleSided:m.side===2,flipSided:m.side===dt,useDepthPacking:m.depthPacking>=0,depthPacking:m.depthPacking||0,index0AttributeName:m.index0AttributeName,extensionDerivatives:Mt&&m.extensions.derivatives===!0,extensionFragDepth:Mt&&m.extensions.fragDepth===!0,extensionDrawBuffers:Mt&&m.extensions.drawBuffers===!0,extensionShaderTextureLOD:Mt&&m.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Mt&&m.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:m.customProgramCacheKey()}},getProgramCacheKey:function(m){let y=[];if(m.shaderID?y.push(m.shaderID):(y.push(m.customVertexShaderID),y.push(m.customFragmentShaderID)),m.defines!==void 0)for(let f in m.defines)y.push(f),y.push(m.defines[f]);return m.isRawShaderMaterial===!1&&(function(f,v){f.push(v.precision),f.push(v.outputColorSpace),f.push(v.envMapMode),f.push(v.envMapCubeUVHeight),f.push(v.mapUv),f.push(v.alphaMapUv),f.push(v.lightMapUv),f.push(v.aoMapUv),f.push(v.bumpMapUv),f.push(v.normalMapUv),f.push(v.displacementMapUv),f.push(v.emissiveMapUv),f.push(v.metalnessMapUv),f.push(v.roughnessMapUv),f.push(v.anisotropyMapUv),f.push(v.clearcoatMapUv),f.push(v.clearcoatNormalMapUv),f.push(v.clearcoatRoughnessMapUv),f.push(v.iridescenceMapUv),f.push(v.iridescenceThicknessMapUv),f.push(v.sheenColorMapUv),f.push(v.sheenRoughnessMapUv),f.push(v.specularMapUv),f.push(v.specularColorMapUv),f.push(v.specularIntensityMapUv),f.push(v.transmissionMapUv),f.push(v.thicknessMapUv),f.push(v.combine),f.push(v.fogExp2),f.push(v.sizeAttenuation),f.push(v.morphTargetsCount),f.push(v.morphAttributeCount),f.push(v.numDirLights),f.push(v.numPointLights),f.push(v.numSpotLights),f.push(v.numSpotLightMaps),f.push(v.numHemiLights),f.push(v.numRectAreaLights),f.push(v.numDirLightShadows),f.push(v.numPointLightShadows),f.push(v.numSpotLightShadows),f.push(v.numSpotLightShadowsWithMaps),f.push(v.numLightProbes),f.push(v.shadowMapType),f.push(v.toneMapping),f.push(v.numClippingPlanes),f.push(v.numClipIntersection),f.push(v.depthPacking)}(y,m),function(f,v){o.disableAll(),v.isWebGL2&&o.enable(0),v.supportsVertexTextures&&o.enable(1),v.instancing&&o.enable(2),v.instancingColor&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),f.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.skinning&&o.enable(4),v.morphTargets&&o.enable(5),v.morphNormals&&o.enable(6),v.morphColors&&o.enable(7),v.premultipliedAlpha&&o.enable(8),v.shadowMapEnabled&&o.enable(9),v.useLegacyLights&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),f.push(o.mask)}(y,m),y.push(r.outputColorSpace)),y.push(m.customProgramCacheKey),y.join()},getUniforms:function(m){let y=g[m.type],f;if(y){let v=qt[y];f=Kh.clone(v.uniforms)}else f=m.uniforms;return f},acquireProgram:function(m,y){let f;for(let v=0,b=c.length;v<b;v++){let R=c[v];if(R.cacheKey===y){f=R,++f.usedTimes;break}}return f===void 0&&(f=new hd(r,y,m,s),c.push(f)),f},releaseProgram:function(m){if(--m.usedTimes==0){let y=c.indexOf(m);c[y]=c[c.length-1],c.pop(),m.destroy()}},releaseShaderCache:function(m){l.remove(m)},programs:c,dispose:function(){l.dispose()}}}function pd(){let r=new WeakMap;return{get:function(e){let t=r.get(e);return t===void 0&&(t={},r.set(e,t)),t},remove:function(e){r.delete(e)},update:function(e,t,i){r.get(e)[t]=i},dispose:function(){r=new WeakMap}}}function md(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function uc(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function dc(){let r=[],e=0,t=[],i=[],n=[];function s(a,o,l,c,h,u){let d=r[e];return d===void 0?(d={id:a.id,object:a,geometry:o,material:l,groupOrder:c,renderOrder:a.renderOrder,z:h,group:u},r[e]=d):(d.id=a.id,d.object=a,d.geometry=o,d.material=l,d.groupOrder=c,d.renderOrder=a.renderOrder,d.z=h,d.group=u),e++,d}return{opaque:t,transmissive:i,transparent:n,init:function(){e=0,t.length=0,i.length=0,n.length=0},push:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?i.push(d):l.transparent===!0?n.push(d):t.push(d)},unshift:function(a,o,l,c,h,u){let d=s(a,o,l,c,h,u);l.transmission>0?i.unshift(d):l.transparent===!0?n.unshift(d):t.unshift(d)},finish:function(){for(let a=e,o=r.length;a<o;a++){let l=r[a];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}},sort:function(a,o){t.length>1&&t.sort(a||md),i.length>1&&i.sort(o||uc),n.length>1&&n.sort(o||uc)}}}function fd(){let r=new WeakMap;return{get:function(e,t){let i=r.get(e),n;return i===void 0?(n=new dc,r.set(e,[n])):t>=i.length?(n=new dc,i.push(n)):n=i[t],n},dispose:function(){r=new WeakMap}}}function gd(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new w,color:new Ie};break;case"SpotLight":t={position:new w,direction:new w,color:new Ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new w,color:new Ie,distance:0,decay:0};break;case"HemisphereLight":t={direction:new w,skyColor:new Ie,groundColor:new Ie};break;case"RectAreaLight":t={color:new Ie,position:new w,halfWidth:new w,halfHeight:new w}}return r[e.id]=t,t}}}var _d=0;function vd(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function yd(r,e){let t=new gd,i=function(){let l={};return{get:function(c){if(l[c.id]!==void 0)return l[c.id];let h;switch(c.type){case"DirectionalLight":case"SpotLight":h={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":h={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3}}return l[c.id]=h,h}}}(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new w);let s=new w,a=new we,o=new we;return{setup:function(l,c){let h=0,u=0,d=0;for(let B=0;B<9;B++)n.probe[B].set(0,0,0);let p=0,g=0,_=0,m=0,y=0,f=0,v=0,b=0,R=0,M=0,A=0;l.sort(vd);let U=c===!0?Math.PI:1;for(let B=0,G=l.length;B<G;B++){let x=l[B],I=x.color,L=x.intensity,F=x.distance,ie=x.shadow&&x.shadow.map?x.shadow.map.texture:null;if(x.isAmbientLight)h+=I.r*L*U,u+=I.g*L*U,d+=I.b*L*U;else if(x.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(x.sh.coefficients[k],L);A++}else if(x.isDirectionalLight){let k=t.get(x);if(k.color.copy(x.color).multiplyScalar(x.intensity*U),x.castShadow){let H=x.shadow,X=i.get(x);X.shadowBias=H.bias,X.shadowNormalBias=H.normalBias,X.shadowRadius=H.radius,X.shadowMapSize=H.mapSize,n.directionalShadow[p]=X,n.directionalShadowMap[p]=ie,n.directionalShadowMatrix[p]=x.shadow.matrix,f++}n.directional[p]=k,p++}else if(x.isSpotLight){let k=t.get(x);k.position.setFromMatrixPosition(x.matrixWorld),k.color.copy(I).multiplyScalar(L*U),k.distance=F,k.coneCos=Math.cos(x.angle),k.penumbraCos=Math.cos(x.angle*(1-x.penumbra)),k.decay=x.decay,n.spot[_]=k;let H=x.shadow;if(x.map&&(n.spotLightMap[R]=x.map,R++,H.updateMatrices(x),x.castShadow&&M++),n.spotLightMatrix[_]=H.matrix,x.castShadow){let X=i.get(x);X.shadowBias=H.bias,X.shadowNormalBias=H.normalBias,X.shadowRadius=H.radius,X.shadowMapSize=H.mapSize,n.spotShadow[_]=X,n.spotShadowMap[_]=ie,b++}_++}else if(x.isRectAreaLight){let k=t.get(x);k.color.copy(I).multiplyScalar(L),k.halfWidth.set(.5*x.width,0,0),k.halfHeight.set(0,.5*x.height,0),n.rectArea[m]=k,m++}else if(x.isPointLight){let k=t.get(x);if(k.color.copy(x.color).multiplyScalar(x.intensity*U),k.distance=x.distance,k.decay=x.decay,x.castShadow){let H=x.shadow,X=i.get(x);X.shadowBias=H.bias,X.shadowNormalBias=H.normalBias,X.shadowRadius=H.radius,X.shadowMapSize=H.mapSize,X.shadowCameraNear=H.camera.near,X.shadowCameraFar=H.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=ie,n.pointShadowMatrix[g]=x.shadow.matrix,v++}n.point[g]=k,g++}else if(x.isHemisphereLight){let k=t.get(x);k.skyColor.copy(x.color).multiplyScalar(L*U),k.groundColor.copy(x.groundColor).multiplyScalar(L*U),n.hemi[y]=k,y++}}m>0&&(e.isWebGL2?r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2):r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):r.has("OES_texture_half_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let P=n.hash;P.directionalLength===p&&P.pointLength===g&&P.spotLength===_&&P.rectAreaLength===m&&P.hemiLength===y&&P.numDirectionalShadows===f&&P.numPointShadows===v&&P.numSpotShadows===b&&P.numSpotMaps===R&&P.numLightProbes===A||(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=y,n.directionalShadow.length=f,n.directionalShadowMap.length=f,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=f,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=b+R-M,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=M,n.numLightProbes=A,P.directionalLength=p,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=y,P.numDirectionalShadows=f,P.numPointShadows=v,P.numSpotShadows=b,P.numSpotMaps=R,P.numLightProbes=A,n.version=_d++)},setupView:function(l,c){let h=0,u=0,d=0,p=0,g=0,_=c.matrixWorldInverse;for(let m=0,y=l.length;m<y;m++){let f=l[m];if(f.isDirectionalLight){let v=n.directional[h];v.direction.setFromMatrixPosition(f.matrixWorld),s.setFromMatrixPosition(f.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(_),h++}else if(f.isSpotLight){let v=n.spot[d];v.position.setFromMatrixPosition(f.matrixWorld),v.position.applyMatrix4(_),v.direction.setFromMatrixPosition(f.matrixWorld),s.setFromMatrixPosition(f.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(_),d++}else if(f.isRectAreaLight){let v=n.rectArea[p];v.position.setFromMatrixPosition(f.matrixWorld),v.position.applyMatrix4(_),o.identity(),a.copy(f.matrixWorld),a.premultiply(_),o.extractRotation(a),v.halfWidth.set(.5*f.width,0,0),v.halfHeight.set(0,.5*f.height,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),p++}else if(f.isPointLight){let v=n.point[u];v.position.setFromMatrixPosition(f.matrixWorld),v.position.applyMatrix4(_),u++}else if(f.isHemisphereLight){let v=n.hemi[g];v.direction.setFromMatrixPosition(f.matrixWorld),v.direction.transformDirection(_),g++}}},state:n}}function pc(r,e){let t=new yd(r,e),i=[],n=[];return{init:function(){i.length=0,n.length=0},state:{lightsArray:i,shadowsArray:n,lights:t},setupLights:function(s){t.setup(i,s)},setupLightsView:function(s){t.setupView(i,s)},pushLight:function(s){i.push(s)},pushShadow:function(s){n.push(s)}}}function xd(r,e){let t=new WeakMap;return{get:function(i,n=0){let s=t.get(i),a;return s===void 0?(a=new pc(r,e),t.set(i,[a])):n>=s.length?(a=new pc(r,e),s.push(a)):a=s[n],a},dispose:function(){t=new WeakMap}}}var Ba=class extends zi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},za=class extends zi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Md(r,e,t){let i=new En,n=new le,s=new le,a=new Ye,o=new Ba({depthPacking:3201}),l=new za,c={},h=t.maxTextureSize,u={[yi]:dt,[dt]:yi,2:2},d=new oi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragmentShader:`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new Ge;g.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Se(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sc;let y=this.type;function f(M,A){let U=e.update(_);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,p.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new ai(n.x,n.y)),d.uniforms.shadow_pass.value=M.map.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,r.setRenderTarget(M.mapPass),r.clear(),r.renderBufferDirect(A,null,U,d,_,null),p.uniforms.shadow_pass.value=M.mapPass.texture,p.uniforms.resolution.value=M.mapSize,p.uniforms.radius.value=M.radius,r.setRenderTarget(M.map),r.clear(),r.renderBufferDirect(A,null,U,p,_,null)}function v(M,A,U,P){let B=null,G=U.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(G!==void 0)B=G;else if(B=U.isPointLight===!0?l:o,r.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let x=B.uuid,I=A.uuid,L=c[x];L===void 0&&(L={},c[x]=L);let F=L[I];F===void 0&&(F=B.clone(),L[I]=F,A.addEventListener("dispose",R)),B=F}return B.visible=A.visible,B.wireframe=A.wireframe,B.side=P===ii?A.shadowSide!==null?A.shadowSide:A.side:A.shadowSide!==null?A.shadowSide:u[A.side],B.alphaMap=A.alphaMap,B.alphaTest=A.alphaTest,B.map=A.map,B.clipShadows=A.clipShadows,B.clippingPlanes=A.clippingPlanes,B.clipIntersection=A.clipIntersection,B.displacementMap=A.displacementMap,B.displacementScale=A.displacementScale,B.displacementBias=A.displacementBias,B.wireframeLinewidth=A.wireframeLinewidth,B.linewidth=A.linewidth,U.isPointLight===!0&&B.isMeshDistanceMaterial===!0&&(r.properties.get(B).light=U),B}function b(M,A,U,P,B){if(M.visible===!1)return;if(M.layers.test(A.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&B===ii)&&(!M.frustumCulled||i.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,M.matrixWorld);let x=e.update(M),I=M.material;if(Array.isArray(I)){let L=x.groups;for(let F=0,ie=L.length;F<ie;F++){let k=L[F],H=I[k.materialIndex];if(H&&H.visible){let X=v(M,H,P,B);M.onBeforeShadow(r,M,A,U,x,X,k),r.renderBufferDirect(U,null,x,X,M,k),M.onAfterShadow(r,M,A,U,x,X,k)}}}else if(I.visible){let L=v(M,I,P,B);M.onBeforeShadow(r,M,A,U,x,L,null),r.renderBufferDirect(U,null,x,L,M,null),M.onAfterShadow(r,M,A,U,x,L,null)}}let G=M.children;for(let x=0,I=G.length;x<I;x++)b(G[x],A,U,P,B)}function R(M){M.target.removeEventListener("dispose",R);for(let A in c){let U=c[A],P=M.target.uuid;P in U&&(U[P].dispose(),delete U[P])}}this.render=function(M,A,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;let P=r.getRenderTarget(),B=r.getActiveCubeFace(),G=r.getActiveMipmapLevel(),x=r.state;x.setBlending(0),x.buffers.color.setClear(1,1,1,1),x.buffers.depth.setTest(!0),x.setScissorTest(!1);let I=y!==ii&&this.type===ii,L=y===ii&&this.type!==ii;for(let F=0,ie=M.length;F<ie;F++){let k=M[F],H=k.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",k,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;n.copy(H.mapSize);let X=H.getFrameExtents();if(n.multiply(X),s.copy(H.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/X.x),n.x=s.x*X.x,H.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/X.y),n.y=s.y*X.y,H.mapSize.y=s.y)),H.map===null||I===!0||L===!0){let q=this.type!==ii?{minFilter:_t,magFilter:_t}:{};H.map!==null&&H.map.dispose(),H.map=new ai(n.x,n.y,q),H.map.texture.name=k.name+".shadowMap",H.camera.updateProjectionMatrix()}r.setRenderTarget(H.map),r.clear();let z=H.getViewportCount();for(let q=0;q<z;q++){let oe=H.getViewport(q);a.set(s.x*oe.x,s.y*oe.y,s.x*oe.z,s.y*oe.w),x.viewport(a),H.updateMatrices(k,q),i=H.getFrustum(),b(A,U,H.camera,k,this.type)}H.isPointLightShadow!==!0&&this.type===ii&&f(H,U),H.needsUpdate=!1}y=this.type,m.needsUpdate=!1,r.setRenderTarget(P,B,G)}}function Sd(r,e,t){let i=t.isWebGL2,n=new function(){let S=!1,re=new Ye,j=null,Y=new Ye(0,0,0,0);return{setMask:function(se){j===se||S||(r.colorMask(se,se,se,se),j=se)},setLocked:function(se){S=se},setClear:function(se,ue,pe,me,Me){Me===!0&&(se*=me,ue*=me,pe*=me),re.set(se,ue,pe,me),Y.equals(re)===!1&&(r.clearColor(se,ue,pe,me),Y.copy(re))},reset:function(){S=!1,j=null,Y.set(-1,0,0,0)}}},s=new function(){let S=!1,re=null,j=null,Y=null;return{setTest:function(se){se?Q(r.DEPTH_TEST):D(r.DEPTH_TEST)},setMask:function(se){re===se||S||(r.depthMask(se),re=se)},setFunc:function(se){if(j!==se){switch(se){case 0:r.depthFunc(r.NEVER);break;case 1:r.depthFunc(r.ALWAYS);break;case 2:r.depthFunc(r.LESS);break;case 3:default:r.depthFunc(r.LEQUAL);break;case 4:r.depthFunc(r.EQUAL);break;case 5:r.depthFunc(r.GEQUAL);break;case 6:r.depthFunc(r.GREATER);break;case 7:r.depthFunc(r.NOTEQUAL)}j=se}},setLocked:function(se){S=se},setClear:function(se){Y!==se&&(r.clearDepth(se),Y=se)},reset:function(){S=!1,re=null,j=null,Y=null}}},a=new function(){let S=!1,re=null,j=null,Y=null,se=null,ue=null,pe=null,me=null,Me=null;return{setTest:function(fe){S||(fe?Q(r.STENCIL_TEST):D(r.STENCIL_TEST))},setMask:function(fe){re===fe||S||(r.stencilMask(fe),re=fe)},setFunc:function(fe,ge,Te){j===fe&&Y===ge&&se===Te||(r.stencilFunc(fe,ge,Te),j=fe,Y=ge,se=Te)},setOp:function(fe,ge,Te){ue===fe&&pe===ge&&me===Te||(r.stencilOp(fe,ge,Te),ue=fe,pe=ge,me=Te)},setLocked:function(fe){S=fe},setClear:function(fe){Me!==fe&&(r.clearStencil(fe),Me=fe)},reset:function(){S=!1,re=null,j=null,Y=null,se=null,ue=null,pe=null,me=null,Me=null}}},o=new WeakMap,l=new WeakMap,c={},h={},u=new WeakMap,d=[],p=null,g=!1,_=null,m=null,y=null,f=null,v=null,b=null,R=null,M=new Ie(0,0,0),A=0,U=!1,P=null,B=null,G=null,x=null,I=null,L=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),F=!1,ie=0,k=r.getParameter(r.VERSION);k.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(k)[1]),F=ie>=1):k.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),F=ie>=2);let H=null,X={},z=r.getParameter(r.SCISSOR_BOX),q=r.getParameter(r.VIEWPORT),oe=new Ye().fromArray(z),E=new Ye().fromArray(q);function T(S,re,j,Y){let se=new Uint8Array(4),ue=r.createTexture();r.bindTexture(S,ue),r.texParameteri(S,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(S,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let pe=0;pe<j;pe++)!i||S!==r.TEXTURE_3D&&S!==r.TEXTURE_2D_ARRAY?r.texImage2D(re+pe,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,se):r.texImage3D(re,0,r.RGBA,1,1,Y,0,r.RGBA,r.UNSIGNED_BYTE,se);return ue}let V={};function Q(S){c[S]!==!0&&(r.enable(S),c[S]=!0)}function D(S){c[S]!==!1&&(r.disable(S),c[S]=!1)}V[r.TEXTURE_2D]=T(r.TEXTURE_2D,r.TEXTURE_2D,1),V[r.TEXTURE_CUBE_MAP]=T(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(V[r.TEXTURE_2D_ARRAY]=T(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),V[r.TEXTURE_3D]=T(r.TEXTURE_3D,r.TEXTURE_3D,1,1)),n.setClear(0,0,0,1),s.setClear(1),a.setClear(0),Q(r.DEPTH_TEST),s.setFunc(3),W(!1),ee(1),Q(r.CULL_FACE),N(0);let J={[Pi]:r.FUNC_ADD,101:r.FUNC_SUBTRACT,102:r.FUNC_REVERSE_SUBTRACT};if(i)J[103]=r.MIN,J[104]=r.MAX;else{let S=e.get("EXT_blend_minmax");S!==null&&(J[103]=S.MIN_EXT,J[104]=S.MAX_EXT)}let O={200:r.ZERO,201:r.ONE,202:r.SRC_COLOR,[ya]:r.SRC_ALPHA,210:r.SRC_ALPHA_SATURATE,208:r.DST_COLOR,206:r.DST_ALPHA,203:r.ONE_MINUS_SRC_COLOR,[xa]:r.ONE_MINUS_SRC_ALPHA,209:r.ONE_MINUS_DST_COLOR,207:r.ONE_MINUS_DST_ALPHA,211:r.CONSTANT_COLOR,212:r.ONE_MINUS_CONSTANT_COLOR,213:r.CONSTANT_ALPHA,214:r.ONE_MINUS_CONSTANT_ALPHA};function N(S,re,j,Y,se,ue,pe,me,Me,fe){if(S!==0){if(g===!1&&(Q(r.BLEND),g=!0),S===5)se=se||re,ue=ue||j,pe=pe||Y,re===m&&se===v||(r.blendEquationSeparate(J[re],J[se]),m=re,v=se),j===y&&Y===f&&ue===b&&pe===R||(r.blendFuncSeparate(O[j],O[Y],O[ue],O[pe]),y=j,f=Y,b=ue,R=pe),me.equals(M)!==!1&&Me===A||(r.blendColor(me.r,me.g,me.b,Me),M.copy(me),A=Me),_=S,U=!1;else if(S!==_||fe!==U){if(m===Pi&&v===Pi||(r.blendEquation(r.FUNC_ADD),m=Pi,v=Pi),fe)switch(S){case 1:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.ONE,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",S)}else switch(S){case 1:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case 2:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case 3:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case 4:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",S)}y=null,f=null,b=null,R=null,M.set(0,0,0),A=0,_=S,U=fe}}else g===!0&&(D(r.BLEND),g=!1)}function W(S){P!==S&&(S?r.frontFace(r.CW):r.frontFace(r.CCW),P=S)}function ee(S){S!==0?(Q(r.CULL_FACE),S!==B&&(S===1?r.cullFace(r.BACK):S===2?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):D(r.CULL_FACE),B=S}function $(S,re,j){S?(Q(r.POLYGON_OFFSET_FILL),x===re&&I===j||(r.polygonOffset(re,j),x=re,I=j)):D(r.POLYGON_OFFSET_FILL)}return{buffers:{color:n,depth:s,stencil:a},enable:Q,disable:D,bindFramebuffer:function(S,re){return h[S]!==re&&(r.bindFramebuffer(S,re),h[S]=re,i&&(S===r.DRAW_FRAMEBUFFER&&(h[r.FRAMEBUFFER]=re),S===r.FRAMEBUFFER&&(h[r.DRAW_FRAMEBUFFER]=re)),!0)},drawBuffers:function(S,re){let j=d,Y=!1;if(S)if(j=u.get(re),j===void 0&&(j=[],u.set(re,j)),S.isWebGLMultipleRenderTargets){let se=S.texture;if(j.length!==se.length||j[0]!==r.COLOR_ATTACHMENT0){for(let ue=0,pe=se.length;ue<pe;ue++)j[ue]=r.COLOR_ATTACHMENT0+ue;j.length=se.length,Y=!0}}else j[0]!==r.COLOR_ATTACHMENT0&&(j[0]=r.COLOR_ATTACHMENT0,Y=!0);else j[0]!==r.BACK&&(j[0]=r.BACK,Y=!0);Y&&(t.isWebGL2?r.drawBuffers(j):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(j))},useProgram:function(S){return p!==S&&(r.useProgram(S),p=S,!0)},setBlending:N,setMaterial:function(S,re){S.side===2?D(r.CULL_FACE):Q(r.CULL_FACE);let j=S.side===dt;re&&(j=!j),W(j),S.blending===1&&S.transparent===!1?N(0):N(S.blending,S.blendEquation,S.blendSrc,S.blendDst,S.blendEquationAlpha,S.blendSrcAlpha,S.blendDstAlpha,S.blendColor,S.blendAlpha,S.premultipliedAlpha),s.setFunc(S.depthFunc),s.setTest(S.depthTest),s.setMask(S.depthWrite),n.setMask(S.colorWrite);let Y=S.stencilWrite;a.setTest(Y),Y&&(a.setMask(S.stencilWriteMask),a.setFunc(S.stencilFunc,S.stencilRef,S.stencilFuncMask),a.setOp(S.stencilFail,S.stencilZFail,S.stencilZPass)),$(S.polygonOffset,S.polygonOffsetFactor,S.polygonOffsetUnits),S.alphaToCoverage===!0?Q(r.SAMPLE_ALPHA_TO_COVERAGE):D(r.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:W,setCullFace:ee,setLineWidth:function(S){S!==G&&(F&&r.lineWidth(S),G=S)},setPolygonOffset:$,setScissorTest:function(S){S?Q(r.SCISSOR_TEST):D(r.SCISSOR_TEST)},activeTexture:function(S){S===void 0&&(S=r.TEXTURE0+L-1),H!==S&&(r.activeTexture(S),H=S)},bindTexture:function(S,re,j){j===void 0&&(j=H===null?r.TEXTURE0+L-1:H);let Y=X[j];Y===void 0&&(Y={type:void 0,texture:void 0},X[j]=Y),Y.type===S&&Y.texture===re||(H!==j&&(r.activeTexture(j),H=j),r.bindTexture(S,re||V[S]),Y.type=S,Y.texture=re)},unbindTexture:function(){let S=X[H];S!==void 0&&S.type!==void 0&&(r.bindTexture(S.type,null),S.type=void 0,S.texture=void 0)},compressedTexImage2D:function(){try{r.compressedTexImage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},compressedTexImage3D:function(){try{r.compressedTexImage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texImage2D:function(){try{r.texImage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texImage3D:function(){try{r.texImage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},updateUBOMapping:function(S,re){let j=l.get(re);j===void 0&&(j=new WeakMap,l.set(re,j));let Y=j.get(S);Y===void 0&&(Y=r.getUniformBlockIndex(re,S.name),j.set(S,Y))},uniformBlockBinding:function(S,re){let j=l.get(re).get(S);o.get(re)!==j&&(r.uniformBlockBinding(re,j,S.__bindingPointIndex),o.set(re,j))},texStorage2D:function(){try{r.texStorage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texStorage3D:function(){try{r.texStorage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texSubImage2D:function(){try{r.texSubImage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},texSubImage3D:function(){try{r.texSubImage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},compressedTexSubImage2D:function(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},compressedTexSubImage3D:function(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(S){console.error("THREE.WebGLState:",S)}},scissor:function(S){oe.equals(S)===!1&&(r.scissor(S.x,S.y,S.z,S.w),oe.copy(S))},viewport:function(S){E.equals(S)===!1&&(r.viewport(S.x,S.y,S.z,S.w),E.copy(S))},reset:function(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),i===!0&&(r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null)),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),c={},H=null,X={},h={},u=new WeakMap,d=[],p=null,g=!1,_=null,m=null,y=null,f=null,v=null,b=null,R=null,M=new Ie(0,0,0),A=0,U=!1,P=null,B=null,G=null,x=null,I=null,oe.set(0,0,r.canvas.width,r.canvas.height),E.set(0,0,r.canvas.width,r.canvas.height),n.reset(),s.reset(),a.reset()}}}function bd(r,e,t,i,n,s,a){let o=n.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator<"u"&&/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,T){return p?new OffscreenCanvas(E,T):$r("canvas")}function _(E,T,V,Q){let D=1;if((E.width>Q||E.height>Q)&&(D=Q/Math.max(E.width,E.height)),D<1||T===!0){if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap){let J=T?Aa:Math.floor,O=J(D*E.width),N=J(D*E.height);u===void 0&&(u=g(O,N));let W=V?g(O,N):u;return W.width=O,W.height=N,W.getContext("2d").drawImage(E,0,0,O,N),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+E.width+"x"+E.height+") to ("+O+"x"+N+")."),W}return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+E.width+"x"+E.height+")."),E}return E}function m(E){return Ll(E.width)&&Ll(E.height)}function y(E,T){return E.generateMipmaps&&T&&E.minFilter!==_t&&E.minFilter!==Et}function f(E){r.generateMipmap(E)}function v(E,T,V,Q,D=!1){if(o===!1)return T;if(E!==null){if(r[E]!==void 0)return r[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let J=T;if(T===r.RED&&(V===r.FLOAT&&(J=r.R32F),V===r.HALF_FLOAT&&(J=r.R16F),V===r.UNSIGNED_BYTE&&(J=r.R8)),T===r.RED_INTEGER&&(V===r.UNSIGNED_BYTE&&(J=r.R8UI),V===r.UNSIGNED_SHORT&&(J=r.R16UI),V===r.UNSIGNED_INT&&(J=r.R32UI),V===r.BYTE&&(J=r.R8I),V===r.SHORT&&(J=r.R16I),V===r.INT&&(J=r.R32I)),T===r.RG&&(V===r.FLOAT&&(J=r.RG32F),V===r.HALF_FLOAT&&(J=r.RG16F),V===r.UNSIGNED_BYTE&&(J=r.RG8)),T===r.RGBA){let O=D?Yr:Be.getTransfer(Q);V===r.FLOAT&&(J=r.RGBA32F),V===r.HALF_FLOAT&&(J=r.RGBA16F),V===r.UNSIGNED_BYTE&&(J=O===He?r.SRGB8_ALPHA8:r.RGBA8),V===r.UNSIGNED_SHORT_4_4_4_4&&(J=r.RGBA4),V===r.UNSIGNED_SHORT_5_5_5_1&&(J=r.RGB5_A1)}return J!==r.R16F&&J!==r.R32F&&J!==r.RG16F&&J!==r.RG32F&&J!==r.RGBA16F&&J!==r.RGBA32F||e.get("EXT_color_buffer_float"),J}function b(E,T,V){return y(E,V)===!0||E.isFramebufferTexture&&E.minFilter!==_t&&E.minFilter!==Et?Math.log2(Math.max(T.width,T.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?T.mipmaps.length:1}function R(E){return E===_t||E===Qo||E===Os?r.NEAREST:r.LINEAR}function M(E){let T=E.target;T.removeEventListener("dispose",M),function(V){let Q=i.get(V);if(Q.__webglInit===void 0)return;let D=V.source,J=d.get(D);if(J){let O=J[Q.__cacheKey];O.usedTimes--,O.usedTimes===0&&U(V),Object.keys(J).length===0&&d.delete(D)}i.remove(V)}(T),T.isVideoTexture&&h.delete(T)}function A(E){let T=E.target;T.removeEventListener("dispose",A),function(V){let Q=V.texture,D=i.get(V),J=i.get(Q);if(J.__webglTexture!==void 0&&(r.deleteTexture(J.__webglTexture),a.memory.textures--),V.depthTexture&&V.depthTexture.dispose(),V.isWebGLCubeRenderTarget)for(let O=0;O<6;O++){if(Array.isArray(D.__webglFramebuffer[O]))for(let N=0;N<D.__webglFramebuffer[O].length;N++)r.deleteFramebuffer(D.__webglFramebuffer[O][N]);else r.deleteFramebuffer(D.__webglFramebuffer[O]);D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer[O])}else{if(Array.isArray(D.__webglFramebuffer))for(let O=0;O<D.__webglFramebuffer.length;O++)r.deleteFramebuffer(D.__webglFramebuffer[O]);else r.deleteFramebuffer(D.__webglFramebuffer);if(D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer),D.__webglMultisampledFramebuffer&&r.deleteFramebuffer(D.__webglMultisampledFramebuffer),D.__webglColorRenderbuffer)for(let O=0;O<D.__webglColorRenderbuffer.length;O++)D.__webglColorRenderbuffer[O]&&r.deleteRenderbuffer(D.__webglColorRenderbuffer[O]);D.__webglDepthRenderbuffer&&r.deleteRenderbuffer(D.__webglDepthRenderbuffer)}if(V.isWebGLMultipleRenderTargets)for(let O=0,N=Q.length;O<N;O++){let W=i.get(Q[O]);W.__webglTexture&&(r.deleteTexture(W.__webglTexture),a.memory.textures--),i.remove(Q[O])}i.remove(Q),i.remove(V)}(T)}function U(E){let T=i.get(E);r.deleteTexture(T.__webglTexture);let V=E.source;delete d.get(V)[T.__cacheKey],a.memory.textures--}let P=0;function B(E,T){let V=i.get(E);if(E.isVideoTexture&&function(Q){let D=a.render.frame;h.get(Q)!==D&&(h.set(Q,D),Q.update())}(E),E.isRenderTargetTexture===!1&&E.version>0&&V.__version!==E.version){let Q=E.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(Q.complete!==!1)return void ie(V,E,T);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}t.bindTexture(r.TEXTURE_2D,V.__webglTexture,r.TEXTURE0+T)}let G={[ba]:r.REPEAT,[ri]:r.CLAMP_TO_EDGE,[Ea]:r.MIRRORED_REPEAT},x={[_t]:r.NEAREST,[Qo]:r.NEAREST_MIPMAP_NEAREST,[Os]:r.NEAREST_MIPMAP_LINEAR,[Et]:r.LINEAR,[Dh]:r.LINEAR_MIPMAP_NEAREST,[Xr]:r.LINEAR_MIPMAP_LINEAR},I={512:r.NEVER,519:r.ALWAYS,513:r.LESS,515:r.LEQUAL,514:r.EQUAL,518:r.GEQUAL,516:r.GREATER,517:r.NOTEQUAL};function L(E,T,V){if(V?(r.texParameteri(E,r.TEXTURE_WRAP_S,G[T.wrapS]),r.texParameteri(E,r.TEXTURE_WRAP_T,G[T.wrapT]),E!==r.TEXTURE_3D&&E!==r.TEXTURE_2D_ARRAY||r.texParameteri(E,r.TEXTURE_WRAP_R,G[T.wrapR]),r.texParameteri(E,r.TEXTURE_MAG_FILTER,x[T.magFilter]),r.texParameteri(E,r.TEXTURE_MIN_FILTER,x[T.minFilter])):(r.texParameteri(E,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(E,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),E!==r.TEXTURE_3D&&E!==r.TEXTURE_2D_ARRAY||r.texParameteri(E,r.TEXTURE_WRAP_R,r.CLAMP_TO_EDGE),T.wrapS===ri&&T.wrapT===ri||console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),r.texParameteri(E,r.TEXTURE_MAG_FILTER,R(T.magFilter)),r.texParameteri(E,r.TEXTURE_MIN_FILTER,R(T.minFilter)),T.minFilter!==_t&&T.minFilter!==Et&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),T.compareFunction&&(r.texParameteri(E,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(E,r.TEXTURE_COMPARE_FUNC,I[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){let Q=e.get("EXT_texture_filter_anisotropic");if(T.magFilter===_t||T.minFilter!==Os&&T.minFilter!==Xr||T.type===gi&&e.has("OES_texture_float_linear")===!1||o===!1&&T.type===Jn&&e.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||i.get(T).__currentAnisotropy)&&(r.texParameterf(E,Q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,n.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy)}}function F(E,T){let V=!1;E.__webglInit===void 0&&(E.__webglInit=!0,T.addEventListener("dispose",M));let Q=T.source,D=d.get(Q);D===void 0&&(D={},d.set(Q,D));let J=function(O){let N=[];return N.push(O.wrapS),N.push(O.wrapT),N.push(O.wrapR||0),N.push(O.magFilter),N.push(O.minFilter),N.push(O.anisotropy),N.push(O.internalFormat),N.push(O.format),N.push(O.type),N.push(O.generateMipmaps),N.push(O.premultiplyAlpha),N.push(O.flipY),N.push(O.unpackAlignment),N.push(O.colorSpace),N.join()}(T);if(J!==E.__cacheKey){D[J]===void 0&&(D[J]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,V=!0),D[J].usedTimes++;let O=D[E.__cacheKey];O!==void 0&&(D[E.__cacheKey].usedTimes--,O.usedTimes===0&&U(T)),E.__cacheKey=J,E.__webglTexture=D[J].texture}return V}function ie(E,T,V){let Q=r.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(Q=r.TEXTURE_2D_ARRAY),T.isData3DTexture&&(Q=r.TEXTURE_3D);let D=F(E,T),J=T.source;t.bindTexture(Q,E.__webglTexture,r.TEXTURE0+V);let O=i.get(J);if(J.version!==O.__version||D===!0){t.activeTexture(r.TEXTURE0+V);let N=Be.getPrimaries(Be.workingColorSpace),W=T.colorSpace===Yt?null:Be.getPrimaries(T.colorSpace),ee=T.colorSpace===Yt||N===W?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let $=function(ge){return!o&&(ge.wrapS!==ri||ge.wrapT!==ri||ge.minFilter!==_t&&ge.minFilter!==Et)}(T)&&m(T.image)===!1,S=_(T.image,$,!1,n.maxTextureSize);S=oe(T,S);let re=m(S)||o,j=s.convert(T.format,T.colorSpace),Y,se=s.convert(T.type),ue=v(T.internalFormat,j,se,T.colorSpace,T.isVideoTexture);L(Q,T,re);let pe=T.mipmaps,me=o&&T.isVideoTexture!==!0&&ue!==Pc,Me=O.__version===void 0||D===!0,fe=b(T,S,re);if(T.isDepthTexture)ue=r.DEPTH_COMPONENT,o?ue=T.type===gi?r.DEPTH_COMPONENT32F:T.type===fi?r.DEPTH_COMPONENT24:T.type===Oi?r.DEPTH24_STENCIL8:r.DEPTH_COMPONENT16:T.type===gi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===Fi&&ue===r.DEPTH_COMPONENT&&T.type!==xo&&T.type!==fi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=fi,se=s.convert(T.type)),T.format===gn&&ue===r.DEPTH_COMPONENT&&(ue=r.DEPTH_STENCIL,T.type!==Oi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=Oi,se=s.convert(T.type))),Me&&(me?t.texStorage2D(r.TEXTURE_2D,1,ue,S.width,S.height):t.texImage2D(r.TEXTURE_2D,0,ue,S.width,S.height,0,j,se,null));else if(T.isDataTexture)if(pe.length>0&&re){me&&Me&&t.texStorage2D(r.TEXTURE_2D,fe,ue,pe[0].width,pe[0].height);for(let ge=0,Te=pe.length;ge<Te;ge++)Y=pe[ge],me?t.texSubImage2D(r.TEXTURE_2D,ge,0,0,Y.width,Y.height,j,se,Y.data):t.texImage2D(r.TEXTURE_2D,ge,ue,Y.width,Y.height,0,j,se,Y.data);T.generateMipmaps=!1}else me?(Me&&t.texStorage2D(r.TEXTURE_2D,fe,ue,S.width,S.height),t.texSubImage2D(r.TEXTURE_2D,0,0,0,S.width,S.height,j,se,S.data)):t.texImage2D(r.TEXTURE_2D,0,ue,S.width,S.height,0,j,se,S.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){me&&Me&&t.texStorage3D(r.TEXTURE_2D_ARRAY,fe,ue,pe[0].width,pe[0].height,S.depth);for(let ge=0,Te=pe.length;ge<Te;ge++)Y=pe[ge],T.format!==Pt?j!==null?me?t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ge,0,0,0,Y.width,Y.height,S.depth,j,Y.data,0,0):t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ge,ue,Y.width,Y.height,S.depth,0,Y.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):me?t.texSubImage3D(r.TEXTURE_2D_ARRAY,ge,0,0,0,Y.width,Y.height,S.depth,j,se,Y.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ge,ue,Y.width,Y.height,S.depth,0,j,se,Y.data)}else{me&&Me&&t.texStorage2D(r.TEXTURE_2D,fe,ue,pe[0].width,pe[0].height);for(let ge=0,Te=pe.length;ge<Te;ge++)Y=pe[ge],T.format!==Pt?j!==null?me?t.compressedTexSubImage2D(r.TEXTURE_2D,ge,0,0,Y.width,Y.height,j,Y.data):t.compressedTexImage2D(r.TEXTURE_2D,ge,ue,Y.width,Y.height,0,Y.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):me?t.texSubImage2D(r.TEXTURE_2D,ge,0,0,Y.width,Y.height,j,se,Y.data):t.texImage2D(r.TEXTURE_2D,ge,ue,Y.width,Y.height,0,j,se,Y.data)}else if(T.isDataArrayTexture)me?(Me&&t.texStorage3D(r.TEXTURE_2D_ARRAY,fe,ue,S.width,S.height,S.depth),t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,S.width,S.height,S.depth,j,se,S.data)):t.texImage3D(r.TEXTURE_2D_ARRAY,0,ue,S.width,S.height,S.depth,0,j,se,S.data);else if(T.isData3DTexture)me?(Me&&t.texStorage3D(r.TEXTURE_3D,fe,ue,S.width,S.height,S.depth),t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,S.width,S.height,S.depth,j,se,S.data)):t.texImage3D(r.TEXTURE_3D,0,ue,S.width,S.height,S.depth,0,j,se,S.data);else if(T.isFramebufferTexture){if(Me)if(me)t.texStorage2D(r.TEXTURE_2D,fe,ue,S.width,S.height);else{let ge=S.width,Te=S.height;for(let et=0;et<fe;et++)t.texImage2D(r.TEXTURE_2D,et,ue,ge,Te,0,j,se,null),ge>>=1,Te>>=1}}else if(pe.length>0&&re){me&&Me&&t.texStorage2D(r.TEXTURE_2D,fe,ue,pe[0].width,pe[0].height);for(let ge=0,Te=pe.length;ge<Te;ge++)Y=pe[ge],me?t.texSubImage2D(r.TEXTURE_2D,ge,0,0,j,se,Y):t.texImage2D(r.TEXTURE_2D,ge,ue,j,se,Y);T.generateMipmaps=!1}else me?(Me&&t.texStorage2D(r.TEXTURE_2D,fe,ue,S.width,S.height),t.texSubImage2D(r.TEXTURE_2D,0,0,0,j,se,S)):t.texImage2D(r.TEXTURE_2D,0,ue,j,se,S);y(T,re)&&f(Q),O.__version=J.version,T.onUpdate&&T.onUpdate(T)}E.__version=T.version}function k(E,T,V,Q,D,J){let O=s.convert(V.format,V.colorSpace),N=s.convert(V.type),W=v(V.internalFormat,O,N,V.colorSpace);if(!i.get(T).__hasExternalTextures){let ee=Math.max(1,T.width>>J),$=Math.max(1,T.height>>J);D===r.TEXTURE_3D||D===r.TEXTURE_2D_ARRAY?t.texImage3D(D,J,W,ee,$,T.depth,0,O,N,null):t.texImage2D(D,J,W,ee,$,0,O,N,null)}t.bindFramebuffer(r.FRAMEBUFFER,E),q(T)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Q,D,i.get(V).__webglTexture,0,z(T)):(D===r.TEXTURE_2D||D>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&D<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,Q,D,i.get(V).__webglTexture,J),t.bindFramebuffer(r.FRAMEBUFFER,null)}function H(E,T,V){if(r.bindRenderbuffer(r.RENDERBUFFER,E),T.depthBuffer&&!T.stencilBuffer){let Q=o===!0?r.DEPTH_COMPONENT24:r.DEPTH_COMPONENT16;if(V||q(T)){let D=T.depthTexture;D&&D.isDepthTexture&&(D.type===gi?Q=r.DEPTH_COMPONENT32F:D.type===fi&&(Q=r.DEPTH_COMPONENT24));let J=z(T);q(T)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,J,Q,T.width,T.height):r.renderbufferStorageMultisample(r.RENDERBUFFER,J,Q,T.width,T.height)}else r.renderbufferStorage(r.RENDERBUFFER,Q,T.width,T.height);r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.RENDERBUFFER,E)}else if(T.depthBuffer&&T.stencilBuffer){let Q=z(T);V&&q(T)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Q,r.DEPTH24_STENCIL8,T.width,T.height):q(T)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Q,r.DEPTH24_STENCIL8,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,r.DEPTH_STENCIL,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.RENDERBUFFER,E)}else{let Q=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let D=0;D<Q.length;D++){let J=Q[D],O=s.convert(J.format,J.colorSpace),N=s.convert(J.type),W=v(J.internalFormat,O,N,J.colorSpace),ee=z(T);V&&q(T)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ee,W,T.width,T.height):q(T)?l.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ee,W,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,W,T.width,T.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function X(E){let T=i.get(E),V=E.isWebGLCubeRenderTarget===!0;if(E.depthTexture&&!T.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");(function(Q,D){if(D&&D.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,Q),!D.depthTexture||!D.depthTexture.isDepthTexture)throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");i.get(D.depthTexture).__webglTexture&&D.depthTexture.image.width===D.width&&D.depthTexture.image.height===D.height||(D.depthTexture.image.width=D.width,D.depthTexture.image.height=D.height,D.depthTexture.needsUpdate=!0),B(D.depthTexture,0);let J=i.get(D.depthTexture).__webglTexture,O=z(D);if(D.depthTexture.format===Fi)q(D)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,J,0,O):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,J,0);else{if(D.depthTexture.format!==gn)throw new Error("Unknown depthTexture format");q(D)?l.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,J,0,O):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,J,0)}})(T.__webglFramebuffer,E)}else if(V){T.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)t.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[Q]),T.__webglDepthbuffer[Q]=r.createRenderbuffer(),H(T.__webglDepthbuffer[Q],E,!1)}else t.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=r.createRenderbuffer(),H(T.__webglDepthbuffer,E,!1);t.bindFramebuffer(r.FRAMEBUFFER,null)}function z(E){return Math.min(n.maxSamples,E.samples)}function q(E){let T=i.get(E);return o&&E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function oe(E,T){let V=E.colorSpace,Q=E.format,D=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||E.format===Ta||V!==si&&V!==Yt&&(Be.getTransfer(V)===He?o===!1?e.has("EXT_sRGB")===!0&&Q===Pt?(E.format=Ta,E.minFilter=Et,E.generateMipmaps=!1):T=Qr.sRGBToLinear(T):Q===Pt&&D===Ni||console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),T}this.allocateTextureUnit=function(){let E=P;return E>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+n.maxTextures),P+=1,E},this.resetTextureUnits=function(){P=0},this.setTexture2D=B,this.setTexture2DArray=function(E,T){let V=i.get(E);E.version>0&&V.__version!==E.version?ie(V,E,T):t.bindTexture(r.TEXTURE_2D_ARRAY,V.__webglTexture,r.TEXTURE0+T)},this.setTexture3D=function(E,T){let V=i.get(E);E.version>0&&V.__version!==E.version?ie(V,E,T):t.bindTexture(r.TEXTURE_3D,V.__webglTexture,r.TEXTURE0+T)},this.setTextureCube=function(E,T){let V=i.get(E);E.version>0&&V.__version!==E.version?function(Q,D,J){if(D.image.length!==6)return;let O=F(Q,D),N=D.source;t.bindTexture(r.TEXTURE_CUBE_MAP,Q.__webglTexture,r.TEXTURE0+J);let W=i.get(N);if(N.version!==W.__version||O===!0){t.activeTexture(r.TEXTURE0+J);let ee=Be.getPrimaries(Be.workingColorSpace),$=D.colorSpace===Yt?null:Be.getPrimaries(D.colorSpace),S=D.colorSpace===Yt||ee===$?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,D.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,D.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,S);let re=D.isCompressedTexture||D.image[0].isCompressedTexture,j=D.image[0]&&D.image[0].isDataTexture,Y=[];for(let _e=0;_e<6;_e++)Y[_e]=re||j?j?D.image[_e].image:D.image[_e]:_(D.image[_e],!1,!0,n.maxCubemapSize),Y[_e]=oe(D,Y[_e]);let se=Y[0],ue=m(se)||o,pe=s.convert(D.format,D.colorSpace),me=s.convert(D.type),Me=v(D.internalFormat,pe,me,D.colorSpace),fe=o&&D.isVideoTexture!==!0,ge=W.__version===void 0||O===!0,Te,et=b(D,se,ue);if(L(r.TEXTURE_CUBE_MAP,D,ue),re){fe&&ge&&t.texStorage2D(r.TEXTURE_CUBE_MAP,et,Me,se.width,se.height);for(let _e=0;_e<6;_e++){Te=Y[_e].mipmaps;for(let Ne=0;Ne<Te.length;Ne++){let Le=Te[Ne];D.format!==Pt?pe!==null?fe?t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne,0,0,Le.width,Le.height,pe,Le.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne,Me,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):fe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne,0,0,Le.width,Le.height,pe,me,Le.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne,Me,Le.width,Le.height,0,pe,me,Le.data)}}}else{Te=D.mipmaps,fe&&ge&&(Te.length>0&&et++,t.texStorage2D(r.TEXTURE_CUBE_MAP,et,Me,Y[0].width,Y[0].height));for(let _e=0;_e<6;_e++)if(j){fe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,Y[_e].width,Y[_e].height,pe,me,Y[_e].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,Me,Y[_e].width,Y[_e].height,0,pe,me,Y[_e].data);for(let Ne=0;Ne<Te.length;Ne++){let Le=Te[Ne].image[_e].image;fe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne+1,0,0,Le.width,Le.height,pe,me,Le.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne+1,Me,Le.width,Le.height,0,pe,me,Le.data)}}else{fe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,pe,me,Y[_e]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,Me,pe,me,Y[_e]);for(let Ne=0;Ne<Te.length;Ne++){let Le=Te[Ne];fe?t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne+1,0,0,pe,me,Le.image[_e]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne+1,Me,pe,me,Le.image[_e])}}}y(D,ue)&&f(r.TEXTURE_CUBE_MAP),W.__version=N.version,D.onUpdate&&D.onUpdate(D)}Q.__version=D.version}(V,E,T):t.bindTexture(r.TEXTURE_CUBE_MAP,V.__webglTexture,r.TEXTURE0+T)},this.rebindTextures=function(E,T,V){let Q=i.get(E);T!==void 0&&k(Q.__webglFramebuffer,E,E.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),V!==void 0&&X(E)},this.setupRenderTarget=function(E){let T=E.texture,V=i.get(E),Q=i.get(T);E.addEventListener("dispose",A),E.isWebGLMultipleRenderTargets!==!0&&(Q.__webglTexture===void 0&&(Q.__webglTexture=r.createTexture()),Q.__version=T.version,a.memory.textures++);let D=E.isWebGLCubeRenderTarget===!0,J=E.isWebGLMultipleRenderTargets===!0,O=m(E)||o;if(D){V.__webglFramebuffer=[];for(let N=0;N<6;N++)if(o&&T.mipmaps&&T.mipmaps.length>0){V.__webglFramebuffer[N]=[];for(let W=0;W<T.mipmaps.length;W++)V.__webglFramebuffer[N][W]=r.createFramebuffer()}else V.__webglFramebuffer[N]=r.createFramebuffer()}else{if(o&&T.mipmaps&&T.mipmaps.length>0){V.__webglFramebuffer=[];for(let N=0;N<T.mipmaps.length;N++)V.__webglFramebuffer[N]=r.createFramebuffer()}else V.__webglFramebuffer=r.createFramebuffer();if(J)if(n.drawBuffers){let N=E.texture;for(let W=0,ee=N.length;W<ee;W++){let $=i.get(N[W]);$.__webglTexture===void 0&&($.__webglTexture=r.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&E.samples>0&&q(E)===!1){let N=J?T:[T];V.__webglMultisampledFramebuffer=r.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let W=0;W<N.length;W++){let ee=N[W];V.__webglColorRenderbuffer[W]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,V.__webglColorRenderbuffer[W]);let $=s.convert(ee.format,ee.colorSpace),S=s.convert(ee.type),re=v(ee.internalFormat,$,S,ee.colorSpace,E.isXRRenderTarget===!0),j=z(E);r.renderbufferStorageMultisample(r.RENDERBUFFER,j,re,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+W,r.RENDERBUFFER,V.__webglColorRenderbuffer[W])}r.bindRenderbuffer(r.RENDERBUFFER,null),E.depthBuffer&&(V.__webglDepthRenderbuffer=r.createRenderbuffer(),H(V.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(D){t.bindTexture(r.TEXTURE_CUBE_MAP,Q.__webglTexture),L(r.TEXTURE_CUBE_MAP,T,O);for(let N=0;N<6;N++)if(o&&T.mipmaps&&T.mipmaps.length>0)for(let W=0;W<T.mipmaps.length;W++)k(V.__webglFramebuffer[N][W],E,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+N,W);else k(V.__webglFramebuffer[N],E,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+N,0);y(T,O)&&f(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(J){let N=E.texture;for(let W=0,ee=N.length;W<ee;W++){let $=N[W],S=i.get($);t.bindTexture(r.TEXTURE_2D,S.__webglTexture),L(r.TEXTURE_2D,$,O),k(V.__webglFramebuffer,E,$,r.COLOR_ATTACHMENT0+W,r.TEXTURE_2D,0),y($,O)&&f(r.TEXTURE_2D)}t.unbindTexture()}else{let N=r.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(o?N=E.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(N,Q.__webglTexture),L(N,T,O),o&&T.mipmaps&&T.mipmaps.length>0)for(let W=0;W<T.mipmaps.length;W++)k(V.__webglFramebuffer[W],E,T,r.COLOR_ATTACHMENT0,N,W);else k(V.__webglFramebuffer,E,T,r.COLOR_ATTACHMENT0,N,0);y(T,O)&&f(N),t.unbindTexture()}E.depthBuffer&&X(E)},this.updateRenderTargetMipmap=function(E){let T=m(E)||o,V=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let Q=0,D=V.length;Q<D;Q++){let J=V[Q];if(y(J,T)){let O=E.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,N=i.get(J).__webglTexture;t.bindTexture(O,N),f(O),t.unbindTexture()}}},this.updateMultisampleRenderTarget=function(E){if(o&&E.samples>0&&q(E)===!1){let T=E.isWebGLMultipleRenderTargets?E.texture:[E.texture],V=E.width,Q=E.height,D=r.COLOR_BUFFER_BIT,J=[],O=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,N=i.get(E),W=E.isWebGLMultipleRenderTargets===!0;if(W)for(let ee=0;ee<T.length;ee++)t.bindFramebuffer(r.FRAMEBUFFER,N.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ee,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,N.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ee,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,N.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,N.__webglFramebuffer);for(let ee=0;ee<T.length;ee++){J.push(r.COLOR_ATTACHMENT0+ee),E.depthBuffer&&J.push(O);let $=N.__ignoreDepthValues!==void 0&&N.__ignoreDepthValues;if($===!1&&(E.depthBuffer&&(D|=r.DEPTH_BUFFER_BIT),E.stencilBuffer&&(D|=r.STENCIL_BUFFER_BIT)),W&&r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,N.__webglColorRenderbuffer[ee]),$===!0&&(r.invalidateFramebuffer(r.READ_FRAMEBUFFER,[O]),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[O])),W){let S=i.get(T[ee]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,S,0)}r.blitFramebuffer(0,0,V,Q,0,0,V,Q,D,r.NEAREST),c&&r.invalidateFramebuffer(r.READ_FRAMEBUFFER,J)}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),W)for(let ee=0;ee<T.length;ee++){t.bindFramebuffer(r.FRAMEBUFFER,N.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ee,r.RENDERBUFFER,N.__webglColorRenderbuffer[ee]);let $=i.get(T[ee]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,N.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ee,r.TEXTURE_2D,$,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,N.__webglMultisampledFramebuffer)}},this.setupDepthRenderbuffer=X,this.setupFrameBufferTexture=k,this.useMultisampledRTT=q}function Ed(r,e,t){let i=t.isWebGL2;return{convert:function(n,s=""){let a,o=Be.getTransfer(s);if(n===Ni)return r.UNSIGNED_BYTE;if(n===wc)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Ac)return r.UNSIGNED_SHORT_5_5_5_1;if(n===1010)return r.BYTE;if(n===1011)return r.SHORT;if(n===xo)return r.UNSIGNED_SHORT;if(n===Tc)return r.INT;if(n===fi)return r.UNSIGNED_INT;if(n===gi)return r.FLOAT;if(n===Jn)return i?r.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(n===1021)return r.ALPHA;if(n===Pt)return r.RGBA;if(n===1024)return r.LUMINANCE;if(n===1025)return r.LUMINANCE_ALPHA;if(n===Fi)return r.DEPTH_COMPONENT;if(n===gn)return r.DEPTH_STENCIL;if(n===Ta)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(n===1028)return r.RED;if(n===Rc)return r.RED_INTEGER;if(n===1030)return r.RG;if(n===Cc)return r.RG_INTEGER;if(n===Lc)return r.RGBA_INTEGER;if(n===Fs||n===Bs||n===zs||n===Hs)if(o===He){if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a===null)return null;if(n===Fs)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Bs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===zs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Hs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(a=e.get("WEBGL_compressed_texture_s3tc"),a===null)return null;if(n===Fs)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Bs)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===zs)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Hs)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(n===el||n===tl||n===il||n===nl){if(a=e.get("WEBGL_compressed_texture_pvrtc"),a===null)return null;if(n===el)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===tl)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===il)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===nl)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(n===Pc)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(n===rl||n===sl){if(a=e.get("WEBGL_compressed_texture_etc"),a===null)return null;if(n===rl)return o===He?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===sl)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}if(n===al||n===ol||n===ll||n===cl||n===hl||n===ul||n===dl||n===pl||n===ml||n===fl||n===gl||n===_l||n===vl||n===yl){if(a=e.get("WEBGL_compressed_texture_astc"),a===null)return null;if(n===al)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ol)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ll)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===cl)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===hl)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ul)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===dl)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===pl)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ml)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===fl)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===gl)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===_l)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===vl)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===yl)return o===He?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}if(n===ks||n===xl||n===Ml){if(a=e.get("EXT_texture_compression_bptc"),a===null)return null;if(n===ks)return o===He?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===xl)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ml)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(n===36283||n===Sl||n===bl||n===El){if(a=e.get("EXT_texture_compression_rgtc"),a===null)return null;if(n===ks)return a.COMPRESSED_RED_RGTC1_EXT;if(n===Sl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===bl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===El)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return n===Oi?i?r.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):r[n]!==void 0?r[n]:null}}}var Ha=class extends Tt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Ke=class extends vt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Td={type:"move"},jn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ke,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ke,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ke,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,i),y=this._getHandJoint(c,_);m!==null&&(y.matrix.fromArray(m.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=m.radius),y.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Td)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Ke;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},ka=class extends xi{constructor(e,t){super();let i=this,n=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null,_=t.getContextAttributes(),m=null,y=null,f=[],v=[],b=new le,R=null,M=new Tt;M.layers.enable(1),M.viewport=new Ye;let A=new Tt;A.layers.enable(2),A.viewport=new Ye;let U=[M,A],P=new Ha;P.layers.enable(1),P.layers.enable(2);let B=null,G=null;function x(z){let q=v.indexOf(z.inputSource);if(q===-1)return;let oe=f[q];oe!==void 0&&(oe.update(z.inputSource,z.frame,c||a),oe.dispatchEvent({type:z.type,data:z.inputSource}))}function I(){n.removeEventListener("select",x),n.removeEventListener("selectstart",x),n.removeEventListener("selectend",x),n.removeEventListener("squeeze",x),n.removeEventListener("squeezestart",x),n.removeEventListener("squeezeend",x),n.removeEventListener("end",I),n.removeEventListener("inputsourceschange",L);for(let z=0;z<f.length;z++){let q=v[z];q!==null&&(v[z]=null,f[z].disconnect(q))}B=null,G=null,e.setRenderTarget(m),p=null,d=null,u=null,n=null,y=null,X.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(b.width,b.height,!1),i.dispatchEvent({type:"sessionend"})}function L(z){for(let q=0;q<z.removed.length;q++){let oe=z.removed[q],E=v.indexOf(oe);E>=0&&(v[E]=null,f[E].disconnect(oe))}for(let q=0;q<z.added.length;q++){let oe=z.added[q],E=v.indexOf(oe);if(E===-1){for(let V=0;V<f.length;V++){if(V>=v.length){v.push(oe),E=V;break}if(v[V]===null){v[V]=oe,E=V;break}}if(E===-1)break}let T=f[E];T&&T.connect(oe)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(z){let q=f[z];return q===void 0&&(q=new jn,f[z]=q),q.getTargetRaySpace()},this.getControllerGrip=function(z){let q=f[z];return q===void 0&&(q=new jn,f[z]=q),q.getGripSpace()},this.getHand=function(z){let q=f[z];return q===void 0&&(q=new jn,f[z]=q),q.getHandSpace()},this.setFramebufferScaleFactor=function(z){s=z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(z){o=z,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(z){c=z},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(z){if(n=z,n!==null){if(m=e.getRenderTarget(),n.addEventListener("select",x),n.addEventListener("selectstart",x),n.addEventListener("selectend",x),n.addEventListener("squeeze",x),n.addEventListener("squeezestart",x),n.addEventListener("squeezeend",x),n.addEventListener("end",I),n.addEventListener("inputsourceschange",L),_.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(b),n.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let q={antialias:n.renderState.layers!==void 0||_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(n,t,q),n.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new ai(p.framebufferWidth,p.framebufferHeight,{format:Pt,type:Ni,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil})}else{let q=null,oe=null,E=null;_.depth&&(E=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,q=_.stencil?gn:Fi,oe=_.stencil?Oi:fi);let T={colorFormat:t.RGBA8,depthFormat:E,scaleFactor:s};u=new XRWebGLBinding(n,t),d=u.createProjectionLayer(T),n.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new ai(d.textureWidth,d.textureHeight,{format:Pt,type:Ni,depthTexture:new as(d.textureWidth,d.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0}),e.properties.get(y).__ignoreDepthValues=d.ignoreDepthValues}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),X.setContext(n),X.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode};let F=new w,ie=new w;function k(z,q){q===null?z.matrixWorld.copy(z.matrix):z.matrixWorld.multiplyMatrices(q.matrixWorld,z.matrix),z.matrixWorldInverse.copy(z.matrixWorld).invert()}this.updateCamera=function(z){if(n===null)return;P.near=A.near=M.near=z.near,P.far=A.far=M.far=z.far,B===P.near&&G===P.far||(n.updateRenderState({depthNear:P.near,depthFar:P.far}),B=P.near,G=P.far);let q=z.parent,oe=P.cameras;k(P,q);for(let E=0;E<oe.length;E++)k(oe[E],q);oe.length===2?function(E,T,V){F.setFromMatrixPosition(T.matrixWorld),ie.setFromMatrixPosition(V.matrixWorld);let Q=F.distanceTo(ie),D=T.projectionMatrix.elements,J=V.projectionMatrix.elements,O=D[14]/(D[10]-1),N=D[14]/(D[10]+1),W=(D[9]+1)/D[5],ee=(D[9]-1)/D[5],$=(D[8]-1)/D[0],S=(J[8]+1)/J[0],re=O*$,j=O*S,Y=Q/(-$+S),se=Y*-$;T.matrixWorld.decompose(E.position,E.quaternion,E.scale),E.translateX(se),E.translateZ(Y),E.matrixWorld.compose(E.position,E.quaternion,E.scale),E.matrixWorldInverse.copy(E.matrixWorld).invert();let ue=O+Y,pe=N+Y,me=re-se,Me=j+(Q-se),fe=W*N/pe*ue,ge=ee*N/pe*ue;E.projectionMatrix.makePerspective(me,Me,fe,ge,ue,pe),E.projectionMatrixInverse.copy(E.projectionMatrix).invert()}(P,M,A):P.projectionMatrix.copy(M.projectionMatrix),function(E,T,V){V===null?E.matrix.copy(T.matrixWorld):(E.matrix.copy(V.matrixWorld),E.matrix.invert(),E.matrix.multiply(T.matrixWorld)),E.matrix.decompose(E.position,E.quaternion,E.scale),E.updateMatrixWorld(!0),E.projectionMatrix.copy(T.projectionMatrix),E.projectionMatrixInverse.copy(T.projectionMatrixInverse),E.isPerspectiveCamera&&(E.fov=2*wa*Math.atan(1/E.projectionMatrix.elements[5]),E.zoom=1)}(z,P,q)},this.getCamera=function(){return P},this.getFoveation=function(){if(d!==null||p!==null)return l},this.setFoveation=function(z){l=z,d!==null&&(d.fixedFoveation=z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=z)};let H=null,X=new Oc;X.setAnimationLoop(function(z,q){if(h=q.getViewerPose(c||a),g=q,h!==null){let oe=h.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let E=!1;oe.length!==P.cameras.length&&(P.cameras.length=0,E=!0);for(let T=0;T<oe.length;T++){let V=oe[T],Q=null;if(p!==null)Q=p.getViewport(V);else{let J=u.getViewSubImage(d,V);Q=J.viewport,T===0&&(e.setRenderTargetTextures(y,J.colorTexture,d.ignoreDepthValues?void 0:J.depthStencilTexture),e.setRenderTarget(y))}let D=U[T];D===void 0&&(D=new Tt,D.layers.enable(T),D.viewport=new Ye,U[T]=D),D.matrix.fromArray(V.transform.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale),D.projectionMatrix.fromArray(V.projectionMatrix),D.projectionMatrixInverse.copy(D.projectionMatrix).invert(),D.viewport.set(Q.x,Q.y,Q.width,Q.height),T===0&&(P.matrix.copy(D.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),E===!0&&P.cameras.push(D)}}for(let oe=0;oe<f.length;oe++){let E=v[oe],T=f[oe];E!==null&&T!==void 0&&T.update(E,q,c||a)}H&&H(z,q),q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:q}),g=null}),this.setAnimationLoop=function(z){H=z},this.dispose=function(){}}};function wd(r,e){function t(n,s){n.matrixAutoUpdate===!0&&n.updateMatrix(),s.value.copy(n.matrix)}function i(n,s){n.opacity.value=s.opacity,s.color&&n.diffuse.value.copy(s.color),s.emissive&&n.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(n.map.value=s.map,t(s.map,n.mapTransform)),s.alphaMap&&(n.alphaMap.value=s.alphaMap,t(s.alphaMap,n.alphaMapTransform)),s.bumpMap&&(n.bumpMap.value=s.bumpMap,t(s.bumpMap,n.bumpMapTransform),n.bumpScale.value=s.bumpScale,s.side===dt&&(n.bumpScale.value*=-1)),s.normalMap&&(n.normalMap.value=s.normalMap,t(s.normalMap,n.normalMapTransform),n.normalScale.value.copy(s.normalScale),s.side===dt&&n.normalScale.value.negate()),s.displacementMap&&(n.displacementMap.value=s.displacementMap,t(s.displacementMap,n.displacementMapTransform),n.displacementScale.value=s.displacementScale,n.displacementBias.value=s.displacementBias),s.emissiveMap&&(n.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,n.emissiveMapTransform)),s.specularMap&&(n.specularMap.value=s.specularMap,t(s.specularMap,n.specularMapTransform)),s.alphaTest>0&&(n.alphaTest.value=s.alphaTest);let a=e.get(s).envMap;if(a&&(n.envMap.value=a,n.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,n.reflectivity.value=s.reflectivity,n.ior.value=s.ior,n.refractionRatio.value=s.refractionRatio),s.lightMap){n.lightMap.value=s.lightMap;let o=r._useLegacyLights===!0?Math.PI:1;n.lightMapIntensity.value=s.lightMapIntensity*o,t(s.lightMap,n.lightMapTransform)}s.aoMap&&(n.aoMap.value=s.aoMap,n.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,n.aoMapTransform))}return{refreshFogUniforms:function(n,s){s.color.getRGB(n.fogColor.value,Nc(r)),s.isFog?(n.fogNear.value=s.near,n.fogFar.value=s.far):s.isFogExp2&&(n.fogDensity.value=s.density)},refreshMaterialUniforms:function(n,s,a,o,l){s.isMeshBasicMaterial||s.isMeshLambertMaterial?i(n,s):s.isMeshToonMaterial?(i(n,s),function(c,h){h.gradientMap&&(c.gradientMap.value=h.gradientMap)}(n,s)):s.isMeshPhongMaterial?(i(n,s),function(c,h){c.specular.value.copy(h.specular),c.shininess.value=Math.max(h.shininess,1e-4)}(n,s)):s.isMeshStandardMaterial?(i(n,s),function(c,h){c.metalness.value=h.metalness,h.metalnessMap&&(c.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,c.metalnessMapTransform)),c.roughness.value=h.roughness,h.roughnessMap&&(c.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,c.roughnessMapTransform)),e.get(h).envMap&&(c.envMapIntensity.value=h.envMapIntensity)}(n,s),s.isMeshPhysicalMaterial&&function(c,h,u){c.ior.value=h.ior,h.sheen>0&&(c.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),c.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(c.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,c.sheenColorMapTransform)),h.sheenRoughnessMap&&(c.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,c.sheenRoughnessMapTransform))),h.clearcoat>0&&(c.clearcoat.value=h.clearcoat,c.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(c.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,c.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(c.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,c.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(c.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,c.clearcoatNormalMapTransform),c.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===dt&&c.clearcoatNormalScale.value.negate())),h.iridescence>0&&(c.iridescence.value=h.iridescence,c.iridescenceIOR.value=h.iridescenceIOR,c.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],c.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(c.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,c.iridescenceMapTransform)),h.iridescenceThicknessMap&&(c.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,c.iridescenceThicknessMapTransform))),h.transmission>0&&(c.transmission.value=h.transmission,c.transmissionSamplerMap.value=u.texture,c.transmissionSamplerSize.value.set(u.width,u.height),h.transmissionMap&&(c.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,c.transmissionMapTransform)),c.thickness.value=h.thickness,h.thicknessMap&&(c.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,c.thicknessMapTransform)),c.attenuationDistance.value=h.attenuationDistance,c.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(c.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(c.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,c.anisotropyMapTransform))),c.specularIntensity.value=h.specularIntensity,c.specularColor.value.copy(h.specularColor),h.specularColorMap&&(c.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,c.specularColorMapTransform)),h.specularIntensityMap&&(c.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,c.specularIntensityMapTransform))}(n,s,l)):s.isMeshMatcapMaterial?(i(n,s),function(c,h){h.matcap&&(c.matcap.value=h.matcap)}(n,s)):s.isMeshDepthMaterial?i(n,s):s.isMeshDistanceMaterial?(i(n,s),function(c,h){let u=e.get(h).light;c.referencePosition.value.setFromMatrixPosition(u.matrixWorld),c.nearDistance.value=u.shadow.camera.near,c.farDistance.value=u.shadow.camera.far}(n,s)):s.isMeshNormalMaterial?i(n,s):s.isLineBasicMaterial?(function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform))}(n,s),s.isLineDashedMaterial&&function(c,h){c.dashSize.value=h.dashSize,c.totalSize.value=h.dashSize+h.gapSize,c.scale.value=h.scale}(n,s)):s.isPointsMaterial?function(c,h,u,d){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.size.value=h.size*u,c.scale.value=.5*d,h.map&&(c.map.value=h.map,t(h.map,c.uvTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)}(n,s,a,o):s.isSpriteMaterial?function(c,h){c.diffuse.value.copy(h.color),c.opacity.value=h.opacity,c.rotation.value=h.rotation,h.map&&(c.map.value=h.map,t(h.map,c.mapTransform)),h.alphaMap&&(c.alphaMap.value=h.alphaMap,t(h.alphaMap,c.alphaMapTransform)),h.alphaTest>0&&(c.alphaTest.value=h.alphaTest)}(n,s):s.isShadowMaterial?(n.color.value.copy(s.color),n.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function Ad(r,e,t,i){let n={},s={},a=[],o=t.isWebGL2?r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(u,d,p,g){let _=u.value,m=d+"_"+p;if(g[m]===void 0)return g[m]=typeof _=="number"||typeof _=="boolean"?_:_.clone(),!0;{let y=g[m];if(typeof _=="number"||typeof _=="boolean"){if(y!==_)return g[m]=_,!0}else if(y.equals(_)===!1)return y.copy(_),!0}return!1}function c(u){let d={boundary:0,storage:0};return typeof u=="number"||typeof u=="boolean"?(d.boundary=4,d.storage=4):u.isVector2?(d.boundary=8,d.storage=8):u.isVector3||u.isColor?(d.boundary=16,d.storage=12):u.isVector4?(d.boundary=16,d.storage=16):u.isMatrix3?(d.boundary=48,d.storage=48):u.isMatrix4?(d.boundary=64,d.storage=64):u.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",u),d}function h(u){let d=u.target;d.removeEventListener("dispose",h);let p=a.indexOf(d.__bindingPointIndex);a.splice(p,1),r.deleteBuffer(n[d.id]),delete n[d.id],delete s[d.id]}return{bind:function(u,d){let p=d.program;i.uniformBlockBinding(u,p)},update:function(u,d){let p=n[u.id];p===void 0&&(function(m){let y=m.uniforms,f=0,v=16;for(let R=0,M=y.length;R<M;R++){let A=Array.isArray(y[R])?y[R]:[y[R]];for(let U=0,P=A.length;U<P;U++){let B=A[U],G=Array.isArray(B.value)?B.value:[B.value];for(let x=0,I=G.length;x<I;x++){let L=c(G[x]),F=f%v;F!==0&&v-F<L.boundary&&(f+=v-F),B.__data=new Float32Array(L.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=f,f+=L.storage}}}let b=f%v;b>0&&(f+=v-b),m.__size=f,m.__cache={}}(u),p=function(m){let y=function(){for(let R=0;R<o;R++)if(a.indexOf(R)===-1)return a.push(R),R;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}();m.__bindingPointIndex=y;let f=r.createBuffer(),v=m.__size,b=m.usage;return r.bindBuffer(r.UNIFORM_BUFFER,f),r.bufferData(r.UNIFORM_BUFFER,v,b),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,y,f),f}(u),n[u.id]=p,u.addEventListener("dispose",h));let g=d.program;i.updateUBOMapping(u,g);let _=e.render.frame;s[u.id]!==_&&(function(m){let y=n[m.id],f=m.uniforms,v=m.__cache;r.bindBuffer(r.UNIFORM_BUFFER,y);for(let b=0,R=f.length;b<R;b++){let M=Array.isArray(f[b])?f[b]:[f[b]];for(let A=0,U=M.length;A<U;A++){let P=M[A];if(l(P,b,A,v)===!0){let B=P.__offset,G=Array.isArray(P.value)?P.value:[P.value],x=0;for(let I=0;I<G.length;I++){let L=G[I],F=c(L);typeof L=="number"||typeof L=="boolean"?(P.__data[0]=L,r.bufferSubData(r.UNIFORM_BUFFER,B+x,P.__data)):L.isMatrix3?(P.__data[0]=L.elements[0],P.__data[1]=L.elements[1],P.__data[2]=L.elements[2],P.__data[3]=0,P.__data[4]=L.elements[3],P.__data[5]=L.elements[4],P.__data[6]=L.elements[5],P.__data[7]=0,P.__data[8]=L.elements[6],P.__data[9]=L.elements[7],P.__data[10]=L.elements[8],P.__data[11]=0):(L.toArray(P.__data,x),x+=F.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,B,P.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}(u),s[u.id]=_)},dispose:function(){for(let u in n)r.deleteBuffer(n[u]);a=[],n={},s={}}}}var $n=class{constructor(e={}){let{canvas:t=Oh(),context:i=null,depth:n=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e,d;this.isWebGLRenderer=!0,d=i!==null?i.getContextAttributes().alpha:a;let p=new Uint32Array(4),g=new Int32Array(4),_=null,m=null,y=[],f=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Je,this._useLegacyLights=!1,this.toneMapping=_i,this.toneMappingExposure=1;let v=this,b=!1,R=0,M=0,A=null,U=-1,P=null,B=new Ye,G=new Ye,x=null,I=new Ie(0),L=0,F=t.width,ie=t.height,k=1,H=null,X=null,z=new Ye(0,0,F,ie),q=new Ye(0,0,F,ie),oe=!1,E=new En,T=!1,V=!1,Q=null,D=new we,J=new le,O=new w,N={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function W(){return A===null?k:1}let ee,$,S,re,j,Y,se,ue,pe,me,Me,fe,ge,Te,et,_e,Ne,Le,cr,ji,hr,At,Mt,qi,K=i;function ur(C,Z){for(let te=0;te<C.length;te++){let ae=C[te],ne=t.getContext(ae,Z);if(ne!==null)return ne}return null}try{let C={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${va}`),t.addEventListener("webglcontextlost",Fo,!1),t.addEventListener("webglcontextrestored",Bo,!1),t.addEventListener("webglcontextcreationerror",zo,!1),K===null){let Z=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&Z.shift(),K=ur(Z,C),K===null)throw ur(Z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&K instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),K.getShaderPrecisionFormat===void 0&&(K.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}function On(){ee=new lu(K),$=new ru(K,ee,e),ee.init($),At=new Ed(K,ee,$),S=new Sd(K,ee,$),re=new uu(K),j=new pd,Y=new bd(K,ee,S,j,$,At,re),se=new au(v),ue=new ou(v),pe=new eu(K,$),Mt=new iu(K,ee,pe,$),me=new cu(K,pe,re,Mt),Me=new fu(K,me,pe,re),cr=new mu(K,$,Y),_e=new su(j),fe=new dd(v,se,ue,ee,$,Mt,_e),ge=new wd(v,j),Te=new fd,et=new xd(ee,$),Le=new tu(v,se,ue,S,Me,d,l),Ne=new Md(v,Me,$),qi=new Ad(K,re,$,S),ji=new nu(K,ee,re,$),hr=new hu(K,ee,re,$),re.programs=fe.programs,v.capabilities=$,v.extensions=ee,v.properties=j,v.renderLists=Te,v.shadowMap=Ne,v.state=S,v.info=re}On();let lt=new ka(v,K);function Fo(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function Bo(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;let C=re.autoReset,Z=Ne.enabled,te=Ne.autoUpdate,ae=Ne.needsUpdate,ne=Ne.type;On(),re.autoReset=C,Ne.enabled=Z,Ne.autoUpdate=te,Ne.needsUpdate=ae,Ne.type=ne}function zo(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Ho(C){let Z=C.target;Z.removeEventListener("dispose",Ho),function(te){(function(ae){let ne=j.get(ae).programs;ne!==void 0&&(ne.forEach(function(de){fe.releaseProgram(de)}),ae.isShaderMaterial&&fe.releaseShaderCache(ae))})(te),j.remove(te)}(Z)}function ko(C,Z,te){C.transparent===!0&&C.side===2&&C.forceSinglePass===!1?(C.side=dt,C.needsUpdate=!0,pr(C,Z,te),C.side=yi,C.needsUpdate=!0,pr(C,Z,te),C.side=2):pr(C,Z,te)}this.xr=lt,this.getContext=function(){return K},this.getContextAttributes=function(){return K.getContextAttributes()},this.forceContextLoss=function(){let C=ee.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){let C=ee.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(C){C!==void 0&&(k=C,this.setSize(F,ie,!1))},this.getSize=function(C){return C.set(F,ie)},this.setSize=function(C,Z,te=!0){lt.isPresenting?console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting."):(F=C,ie=Z,t.width=Math.floor(C*k),t.height=Math.floor(Z*k),te===!0&&(t.style.width=C+"px",t.style.height=Z+"px"),this.setViewport(0,0,C,Z))},this.getDrawingBufferSize=function(C){return C.set(F*k,ie*k).floor()},this.setDrawingBufferSize=function(C,Z,te){F=C,ie=Z,k=te,t.width=Math.floor(C*te),t.height=Math.floor(Z*te),this.setViewport(0,0,C,Z)},this.getCurrentViewport=function(C){return C.copy(B)},this.getViewport=function(C){return C.copy(z)},this.setViewport=function(C,Z,te,ae){C.isVector4?z.set(C.x,C.y,C.z,C.w):z.set(C,Z,te,ae),S.viewport(B.copy(z).multiplyScalar(k).floor())},this.getScissor=function(C){return C.copy(q)},this.setScissor=function(C,Z,te,ae){C.isVector4?q.set(C.x,C.y,C.z,C.w):q.set(C,Z,te,ae),S.scissor(G.copy(q).multiplyScalar(k).floor())},this.getScissorTest=function(){return oe},this.setScissorTest=function(C){S.setScissorTest(oe=C)},this.setOpaqueSort=function(C){H=C},this.setTransparentSort=function(C){X=C},this.getClearColor=function(C){return C.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor.apply(Le,arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha.apply(Le,arguments)},this.clear=function(C=!0,Z=!0,te=!0){let ae=0;if(C){let ne=!1;if(A!==null){let de=A.texture.format;ne=de===Lc||de===Cc||de===Rc}if(ne){let de=A.texture.type,ye=de===Ni||de===fi||de===xo||de===Oi||de===wc||de===Ac,xe=Le.getClearColor(),Ae=Le.getClearAlpha(),Ce=xe.r,Pe=xe.g,Ue=xe.b;ye?(p[0]=Ce,p[1]=Pe,p[2]=Ue,p[3]=Ae,K.clearBufferuiv(K.COLOR,0,p)):(g[0]=Ce,g[1]=Pe,g[2]=Ue,g[3]=Ae,K.clearBufferiv(K.COLOR,0,g))}else ae|=K.COLOR_BUFFER_BIT}Z&&(ae|=K.DEPTH_BUFFER_BIT),te&&(ae|=K.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),K.clear(ae)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Fo,!1),t.removeEventListener("webglcontextrestored",Bo,!1),t.removeEventListener("webglcontextcreationerror",zo,!1),Te.dispose(),et.dispose(),j.dispose(),se.dispose(),ue.dispose(),Me.dispose(),Mt.dispose(),qi.dispose(),fe.dispose(),lt.dispose(),lt.removeEventListener("sessionstart",Go),lt.removeEventListener("sessionend",Vo),Q&&(Q.dispose(),Q=null),Si.stop()},this.renderBufferDirect=function(C,Z,te,ae,ne,de){Z===null&&(Z=N);let ye=ne.isMesh&&ne.matrixWorld.determinant()<0,xe=function(Ze,Rt,yt,De,Oe){Rt.isScene!==!0&&(Rt=N),Y.resetTextureUnits();let Fn=Rt.fog,Ps=De.isMeshStandardMaterial?Rt.environment:null,uh=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:si,mr=(De.isMeshStandardMaterial?ue:se).get(De.envMap||Ps),dh=De.vertexColors===!0&&!!yt.attributes.color&&yt.attributes.color.itemSize===4,ph=!!yt.attributes.tangent&&(!!De.normalMap||De.anisotropy>0),mh=!!yt.morphAttributes.position,fh=!!yt.morphAttributes.normal,gh=!!yt.morphAttributes.color,Zo=_i;De.toneMapped&&(A!==null&&A.isXRRenderTarget!==!0||(Zo=v.toneMapping));let Jo=yt.morphAttributes.position||yt.morphAttributes.normal||yt.morphAttributes.color,_h=Jo!==void 0?Jo.length:0,Fe=j.get(De),vh=m.state.lights;if(T===!0&&(V===!0||Ze!==P)){let Ct=Ze===P&&De.id===U;_e.setState(De,Ze,Ct)}let Ht=!1;De.version===Fe.__version?Fe.needsLights&&Fe.lightsStateVersion!==vh.state.version||Fe.outputColorSpace!==uh||Oe.isBatchedMesh&&Fe.batching===!1?Ht=!0:Oe.isBatchedMesh||Fe.batching!==!0?Oe.isInstancedMesh&&Fe.instancing===!1?Ht=!0:Oe.isInstancedMesh||Fe.instancing!==!0?Oe.isSkinnedMesh&&Fe.skinning===!1?Ht=!0:Oe.isSkinnedMesh||Fe.skinning!==!0?Oe.isInstancedMesh&&Fe.instancingColor===!0&&Oe.instanceColor===null||Oe.isInstancedMesh&&Fe.instancingColor===!1&&Oe.instanceColor!==null||Fe.envMap!==mr||De.fog===!0&&Fe.fog!==Fn?Ht=!0:Fe.numClippingPlanes===void 0||Fe.numClippingPlanes===_e.numPlanes&&Fe.numIntersection===_e.numIntersection?(Fe.vertexAlphas!==dh||Fe.vertexTangents!==ph||Fe.morphTargets!==mh||Fe.morphNormals!==fh||Fe.morphColors!==gh||Fe.toneMapping!==Zo||$.isWebGL2===!0&&Fe.morphTargetsCount!==_h)&&(Ht=!0):Ht=!0:Ht=!0:Ht=!0:Ht=!0:(Ht=!0,Fe.__version=De.version);let Ei=Fe.currentProgram;Ht===!0&&(Ei=pr(De,Rt,Oe));let Ko=!1,Bn=!1,Is=!1,ct=Ei.getUniforms(),Ti=Fe.uniforms;if(S.useProgram(Ei.program)&&(Ko=!0,Bn=!0,Is=!0),De.id!==U&&(U=De.id,Bn=!0),Ko||P!==Ze){ct.setValue(K,"projectionMatrix",Ze.projectionMatrix),ct.setValue(K,"viewMatrix",Ze.matrixWorldInverse);let Ct=ct.map.cameraPosition;Ct!==void 0&&Ct.setValue(K,O.setFromMatrixPosition(Ze.matrixWorld)),$.logarithmicDepthBuffer&&ct.setValue(K,"logDepthBufFC",2/(Math.log(Ze.far+1)/Math.LN2)),(De.isMeshPhongMaterial||De.isMeshToonMaterial||De.isMeshLambertMaterial||De.isMeshBasicMaterial||De.isMeshStandardMaterial||De.isShaderMaterial)&&ct.setValue(K,"isOrthographic",Ze.isOrthographicCamera===!0),P!==Ze&&(P=Ze,Bn=!0,Is=!0)}if(Oe.isSkinnedMesh){ct.setOptional(K,Oe,"bindMatrix"),ct.setOptional(K,Oe,"bindMatrixInverse");let Ct=Oe.skeleton;Ct&&($.floatVertexTextures?(Ct.boneTexture===null&&Ct.computeBoneTexture(),ct.setValue(K,"boneTexture",Ct.boneTexture,Y)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Oe.isBatchedMesh&&(ct.setOptional(K,Oe,"batchingTexture"),ct.setValue(K,"batchingTexture",Oe._matricesTexture,Y));let Us=yt.morphAttributes;(Us.position!==void 0||Us.normal!==void 0||Us.color!==void 0&&$.isWebGL2===!0)&&cr.update(Oe,yt,Ei),(Bn||Fe.receiveShadow!==Oe.receiveShadow)&&(Fe.receiveShadow=Oe.receiveShadow,ct.setValue(K,"receiveShadow",Oe.receiveShadow)),De.isMeshGouraudMaterial&&De.envMap!==null&&(Ti.envMap.value=mr,Ti.flipEnvMap.value=mr.isCubeTexture&&mr.isRenderTargetTexture===!1?-1:1),Bn&&(ct.setValue(K,"toneMappingExposure",v.toneMappingExposure),Fe.needsLights&&(kt=Is,(jt=Ti).ambientLightColor.needsUpdate=kt,jt.lightProbe.needsUpdate=kt,jt.directionalLights.needsUpdate=kt,jt.directionalLightShadows.needsUpdate=kt,jt.pointLights.needsUpdate=kt,jt.pointLightShadows.needsUpdate=kt,jt.spotLights.needsUpdate=kt,jt.spotLightShadows.needsUpdate=kt,jt.rectAreaLights.needsUpdate=kt,jt.hemisphereLights.needsUpdate=kt),Fn&&De.fog===!0&&ge.refreshFogUniforms(Ti,Fn),ge.refreshMaterialUniforms(Ti,De,k,ie,Q),pn.upload(K,qo(Fe),Ti,Y));var jt,kt;if(De.isShaderMaterial&&De.uniformsNeedUpdate===!0&&(pn.upload(K,qo(Fe),Ti,Y),De.uniformsNeedUpdate=!1),De.isSpriteMaterial&&ct.setValue(K,"center",Oe.center),ct.setValue(K,"modelViewMatrix",Oe.modelViewMatrix),ct.setValue(K,"normalMatrix",Oe.normalMatrix),ct.setValue(K,"modelMatrix",Oe.matrixWorld),De.isShaderMaterial||De.isRawShaderMaterial){let Ct=De.uniformsGroups;for(let Ds=0,yh=Ct.length;Ds<yh;Ds++)if($.isWebGL2){let $o=Ct[Ds];qi.update($o,Ei),qi.bind($o,Ei)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ei}(C,Z,te,ae,ne);S.setMaterial(ae,ye);let Ae=te.index,Ce=1;if(ae.wireframe===!0){if(Ae=me.getWireframeAttribute(te),Ae===void 0)return;Ce=2}let Pe=te.drawRange,Ue=te.attributes.position,Ve=Pe.start*Ce,zt=(Pe.start+Pe.count)*Ce;de!==null&&(Ve=Math.max(Ve,de.start*Ce),zt=Math.min(zt,(de.start+de.count)*Ce)),Ae!==null?(Ve=Math.max(Ve,0),zt=Math.min(zt,Ae.count)):Ue!=null&&(Ve=Math.max(Ve,0),zt=Math.min(zt,Ue.count));let Jt=zt-Ve;if(Jt<0||Jt===1/0)return;let bi;Mt.setup(ne,ae,xe,te,Ae);let We=ji;if(Ae!==null&&(bi=pe.get(Ae),We=hr,We.setIndex(bi)),ne.isMesh)ae.wireframe===!0?(S.setLineWidth(ae.wireframeLinewidth*W()),We.setMode(K.LINES)):We.setMode(K.TRIANGLES);else if(ne.isLine){let Ze=ae.linewidth;Ze===void 0&&(Ze=1),S.setLineWidth(Ze*W()),ne.isLineSegments?We.setMode(K.LINES):ne.isLineLoop?We.setMode(K.LINE_LOOP):We.setMode(K.LINE_STRIP)}else ne.isPoints?We.setMode(K.POINTS):ne.isSprite&&We.setMode(K.TRIANGLES);if(ne.isBatchedMesh)We.renderMultiDraw(ne._multiDrawStarts,ne._multiDrawCounts,ne._multiDrawCount);else if(ne.isInstancedMesh)We.renderInstances(Ve,Jt,ne.count);else if(te.isInstancedBufferGeometry){let Ze=te._maxInstanceCount!==void 0?te._maxInstanceCount:1/0,Rt=Math.min(te.instanceCount,Ze);We.renderInstances(Ve,Jt,Rt)}else We.render(Ve,Jt)},this.compile=function(C,Z,te=null){te===null&&(te=C),m=et.get(te),m.init(),f.push(m),te.traverseVisible(function(ne){ne.isLight&&ne.layers.test(Z.layers)&&(m.pushLight(ne),ne.castShadow&&m.pushShadow(ne))}),C!==te&&C.traverseVisible(function(ne){ne.isLight&&ne.layers.test(Z.layers)&&(m.pushLight(ne),ne.castShadow&&m.pushShadow(ne))}),m.setupLights(v._useLegacyLights);let ae=new Set;return C.traverse(function(ne){let de=ne.material;if(de)if(Array.isArray(de))for(let ye=0;ye<de.length;ye++){let xe=de[ye];ko(xe,te,ne),ae.add(xe)}else ko(de,te,ne),ae.add(de)}),f.pop(),m=null,ae},this.compileAsync=function(C,Z,te=null){let ae=this.compile(C,Z,te);return new Promise(ne=>{function de(){ae.forEach(function(ye){j.get(ye).currentProgram.isReady()&&ae.delete(ye)}),ae.size!==0?setTimeout(de,10):ne(C)}ee.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Ls=null;function Go(){Si.stop()}function Vo(){Si.start()}let Si=new Oc;function Wo(C,Z,te,ae){if(C.visible===!1)return;if(C.layers.test(Z.layers)){if(C.isGroup)te=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(Z);else if(C.isLight)m.pushLight(C),C.castShadow&&m.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||E.intersectsSprite(C)){ae&&O.setFromMatrixPosition(C.matrixWorld).applyMatrix4(D);let de=Me.update(C),ye=C.material;ye.visible&&_.push(C,de,ye,te,O.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||E.intersectsObject(C))){let de=Me.update(C),ye=C.material;if(ae&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),O.copy(C.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),O.copy(de.boundingSphere.center)),O.applyMatrix4(C.matrixWorld).applyMatrix4(D)),Array.isArray(ye)){let xe=de.groups;for(let Ae=0,Ce=xe.length;Ae<Ce;Ae++){let Pe=xe[Ae],Ue=ye[Pe.materialIndex];Ue&&Ue.visible&&_.push(C,de,Ue,te,O.z,Pe)}}else ye.visible&&_.push(C,de,ye,te,O.z,null)}}let ne=C.children;for(let de=0,ye=ne.length;de<ye;de++)Wo(ne[de],Z,te,ae)}function Xo(C,Z,te,ae){let ne=C.opaque,de=C.transmissive,ye=C.transparent;m.setupLightsView(te),T===!0&&_e.setGlobalState(v.clippingPlanes,te),de.length>0&&function(xe,Ae,Ce,Pe){if((Ce.isScene===!0?Ce.overrideMaterial:null)!==null)return;let Ve=$.isWebGL2;Q===null&&(Q=new ai(1,1,{generateMipmaps:!0,type:ee.has("EXT_color_buffer_half_float")?Jn:Ni,minFilter:Xr,samples:Ve?4:0})),v.getDrawingBufferSize(J),Ve?Q.setSize(J.x,J.y):Q.setSize(Aa(J.x),Aa(J.y));let zt=v.getRenderTarget();v.setRenderTarget(Q),v.getClearColor(I),L=v.getClearAlpha(),L<1&&v.setClearColor(16777215,.5),v.clear();let Jt=v.toneMapping;v.toneMapping=_i,dr(xe,Ce,Pe),Y.updateMultisampleRenderTarget(Q),Y.updateRenderTargetMipmap(Q);let bi=!1;for(let We=0,Ze=Ae.length;We<Ze;We++){let Rt=Ae[We],yt=Rt.object,De=Rt.geometry,Oe=Rt.material,Fn=Rt.group;if(Oe.side===2&&yt.layers.test(Pe.layers)){let Ps=Oe.side;Oe.side=dt,Oe.needsUpdate=!0,jo(yt,Ce,Pe,De,Oe,Fn),Oe.side=Ps,Oe.needsUpdate=!0,bi=!0}}bi===!0&&(Y.updateMultisampleRenderTarget(Q),Y.updateRenderTargetMipmap(Q)),v.setRenderTarget(zt),v.setClearColor(I,L),v.toneMapping=Jt}(ne,de,Z,te),ae&&S.viewport(B.copy(ae)),ne.length>0&&dr(ne,Z,te),de.length>0&&dr(de,Z,te),ye.length>0&&dr(ye,Z,te),S.buffers.depth.setTest(!0),S.buffers.depth.setMask(!0),S.buffers.color.setMask(!0),S.setPolygonOffset(!1)}function dr(C,Z,te){let ae=Z.isScene===!0?Z.overrideMaterial:null;for(let ne=0,de=C.length;ne<de;ne++){let ye=C[ne],xe=ye.object,Ae=ye.geometry,Ce=ae===null?ye.material:ae,Pe=ye.group;xe.layers.test(te.layers)&&jo(xe,Z,te,Ae,Ce,Pe)}}function jo(C,Z,te,ae,ne,de){C.onBeforeRender(v,Z,te,ae,ne,de),C.modelViewMatrix.multiplyMatrices(te.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),ne.onBeforeRender(v,Z,te,ae,C,de),ne.transparent===!0&&ne.side===2&&ne.forceSinglePass===!1?(ne.side=dt,ne.needsUpdate=!0,v.renderBufferDirect(te,Z,ae,ne,C,de),ne.side=yi,ne.needsUpdate=!0,v.renderBufferDirect(te,Z,ae,ne,C,de),ne.side=2):v.renderBufferDirect(te,Z,ae,ne,C,de),C.onAfterRender(v,Z,te,ae,ne,de)}function pr(C,Z,te){Z.isScene!==!0&&(Z=N);let ae=j.get(C),ne=m.state.lights,de=m.state.shadowsArray,ye=ne.state.version,xe=fe.getParameters(C,ne.state,de,Z,te),Ae=fe.getProgramCacheKey(xe),Ce=ae.programs;ae.environment=C.isMeshStandardMaterial?Z.environment:null,ae.fog=Z.fog,ae.envMap=(C.isMeshStandardMaterial?ue:se).get(C.envMap||ae.environment),Ce===void 0&&(C.addEventListener("dispose",Ho),Ce=new Map,ae.programs=Ce);let Pe=Ce.get(Ae);if(Pe!==void 0){if(ae.currentProgram===Pe&&ae.lightsStateVersion===ye)return Yo(C,xe),Pe}else xe.uniforms=fe.getUniforms(C),C.onBuild(te,xe,v),C.onBeforeCompile(xe,v),Pe=fe.acquireProgram(xe,Ae),Ce.set(Ae,Pe),ae.uniforms=xe.uniforms;let Ue=ae.uniforms;return(C.isShaderMaterial||C.isRawShaderMaterial)&&C.clipping!==!0||(Ue.clippingPlanes=_e.uniform),Yo(C,xe),ae.needsLights=function(Ve){return Ve.isMeshLambertMaterial||Ve.isMeshToonMaterial||Ve.isMeshPhongMaterial||Ve.isMeshStandardMaterial||Ve.isShadowMaterial||Ve.isShaderMaterial&&Ve.lights===!0}(C),ae.lightsStateVersion=ye,ae.needsLights&&(Ue.ambientLightColor.value=ne.state.ambient,Ue.lightProbe.value=ne.state.probe,Ue.directionalLights.value=ne.state.directional,Ue.directionalLightShadows.value=ne.state.directionalShadow,Ue.spotLights.value=ne.state.spot,Ue.spotLightShadows.value=ne.state.spotShadow,Ue.rectAreaLights.value=ne.state.rectArea,Ue.ltc_1.value=ne.state.rectAreaLTC1,Ue.ltc_2.value=ne.state.rectAreaLTC2,Ue.pointLights.value=ne.state.point,Ue.pointLightShadows.value=ne.state.pointShadow,Ue.hemisphereLights.value=ne.state.hemi,Ue.directionalShadowMap.value=ne.state.directionalShadowMap,Ue.directionalShadowMatrix.value=ne.state.directionalShadowMatrix,Ue.spotShadowMap.value=ne.state.spotShadowMap,Ue.spotLightMatrix.value=ne.state.spotLightMatrix,Ue.spotLightMap.value=ne.state.spotLightMap,Ue.pointShadowMap.value=ne.state.pointShadowMap,Ue.pointShadowMatrix.value=ne.state.pointShadowMatrix),ae.currentProgram=Pe,ae.uniformsList=null,Pe}function qo(C){if(C.uniformsList===null){let Z=C.currentProgram.getUniforms();C.uniformsList=pn.seqWithValue(Z.seq,C.uniforms)}return C.uniformsList}function Yo(C,Z){let te=j.get(C);te.outputColorSpace=Z.outputColorSpace,te.batching=Z.batching,te.instancing=Z.instancing,te.instancingColor=Z.instancingColor,te.skinning=Z.skinning,te.morphTargets=Z.morphTargets,te.morphNormals=Z.morphNormals,te.morphColors=Z.morphColors,te.morphTargetsCount=Z.morphTargetsCount,te.numClippingPlanes=Z.numClippingPlanes,te.numIntersection=Z.numClipIntersection,te.vertexAlphas=Z.vertexAlphas,te.vertexTangents=Z.vertexTangents,te.toneMapping=Z.toneMapping}Si.setAnimationLoop(function(C){Ls&&Ls(C)}),typeof self<"u"&&Si.setContext(self),this.setAnimationLoop=function(C){Ls=C,lt.setAnimationLoop(C),C===null?Si.stop():Si.start()},lt.addEventListener("sessionstart",Go),lt.addEventListener("sessionend",Vo),this.render=function(C,Z){if(Z!==void 0&&Z.isCamera!==!0)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(b===!0)return;C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),Z.parent===null&&Z.matrixWorldAutoUpdate===!0&&Z.updateMatrixWorld(),lt.enabled===!0&&lt.isPresenting===!0&&(lt.cameraAutoUpdate===!0&&lt.updateCamera(Z),Z=lt.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,Z,A),m=et.get(C,f.length),m.init(),f.push(m),D.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),E.setFromProjectionMatrix(D),V=this.localClippingEnabled,T=_e.init(this.clippingPlanes,V),_=Te.get(C,y.length),_.init(),y.push(_),Wo(C,Z,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(H,X),this.info.render.frame++,T===!0&&_e.beginShadows();let te=m.state.shadowsArray;if(Ne.render(te,C,Z),T===!0&&_e.endShadows(),this.info.autoReset===!0&&this.info.reset(),Le.render(_,C),m.setupLights(v._useLegacyLights),Z.isArrayCamera){let ae=Z.cameras;for(let ne=0,de=ae.length;ne<de;ne++){let ye=ae[ne];Xo(_,C,ye,ye.viewport)}}else Xo(_,C,Z);A!==null&&(Y.updateMultisampleRenderTarget(A),Y.updateRenderTargetMipmap(A)),C.isScene===!0&&C.onAfterRender(v,C,Z),Mt.resetDefaultState(),U=-1,P=null,f.pop(),m=f.length>0?f[f.length-1]:null,y.pop(),_=y.length>0?y[y.length-1]:null},this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(C,Z,te){j.get(C.texture).__webglTexture=Z,j.get(C.depthTexture).__webglTexture=te;let ae=j.get(C);ae.__hasExternalTextures=!0,ae.__hasExternalTextures&&(ae.__autoAllocateDepthBuffer=te===void 0,ae.__autoAllocateDepthBuffer||ee.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ae.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(C,Z){let te=j.get(C);te.__webglFramebuffer=Z,te.__useDefaultFramebuffer=Z===void 0},this.setRenderTarget=function(C,Z=0,te=0){A=C,R=Z,M=te;let ae=!0,ne=null,de=!1,ye=!1;if(C){let xe=j.get(C);xe.__useDefaultFramebuffer!==void 0?(S.bindFramebuffer(K.FRAMEBUFFER,null),ae=!1):xe.__webglFramebuffer===void 0?Y.setupRenderTarget(C):xe.__hasExternalTextures&&Y.rebindTextures(C,j.get(C.texture).__webglTexture,j.get(C.depthTexture).__webglTexture);let Ae=C.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(ye=!0);let Ce=j.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(ne=Array.isArray(Ce[Z])?Ce[Z][te]:Ce[Z],de=!0):ne=$.isWebGL2&&C.samples>0&&Y.useMultisampledRTT(C)===!1?j.get(C).__webglMultisampledFramebuffer:Array.isArray(Ce)?Ce[te]:Ce,B.copy(C.viewport),G.copy(C.scissor),x=C.scissorTest}else B.copy(z).multiplyScalar(k).floor(),G.copy(q).multiplyScalar(k).floor(),x=oe;if(S.bindFramebuffer(K.FRAMEBUFFER,ne)&&$.drawBuffers&&ae&&S.drawBuffers(C,ne),S.viewport(B),S.scissor(G),S.setScissorTest(x),de){let xe=j.get(C.texture);K.framebufferTexture2D(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,K.TEXTURE_CUBE_MAP_POSITIVE_X+Z,xe.__webglTexture,te)}else if(ye){let xe=j.get(C.texture),Ae=Z||0;K.framebufferTextureLayer(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,xe.__webglTexture,te||0,Ae)}U=-1},this.readRenderTargetPixels=function(C,Z,te,ae,ne,de,ye){if(!C||!C.isWebGLRenderTarget)return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=j.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&ye!==void 0&&(xe=xe[ye]),xe){S.bindFramebuffer(K.FRAMEBUFFER,xe);try{let Ae=C.texture,Ce=Ae.format,Pe=Ae.type;if(Ce!==Pt&&At.convert(Ce)!==K.getParameter(K.IMPLEMENTATION_COLOR_READ_FORMAT))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");let Ue=Pe===Jn&&(ee.has("EXT_color_buffer_half_float")||$.isWebGL2&&ee.has("EXT_color_buffer_float"));if(!(Pe===Ni||At.convert(Pe)===K.getParameter(K.IMPLEMENTATION_COLOR_READ_TYPE)||Pe===gi&&($.isWebGL2||ee.has("OES_texture_float")||ee.has("WEBGL_color_buffer_float"))||Ue))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");Z>=0&&Z<=C.width-ae&&te>=0&&te<=C.height-ne&&K.readPixels(Z,te,ae,ne,At.convert(Ce),At.convert(Pe),de)}finally{let Ae=A!==null?j.get(A).__webglFramebuffer:null;S.bindFramebuffer(K.FRAMEBUFFER,Ae)}}},this.copyFramebufferToTexture=function(C,Z,te=0){let ae=Math.pow(2,-te),ne=Math.floor(Z.image.width*ae),de=Math.floor(Z.image.height*ae);Y.setTexture2D(Z,0),K.copyTexSubImage2D(K.TEXTURE_2D,te,0,0,C.x,C.y,ne,de),S.unbindTexture()},this.copyTextureToTexture=function(C,Z,te,ae=0){let ne=Z.image.width,de=Z.image.height,ye=At.convert(te.format),xe=At.convert(te.type);Y.setTexture2D(te,0),K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,te.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,te.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,te.unpackAlignment),Z.isDataTexture?K.texSubImage2D(K.TEXTURE_2D,ae,C.x,C.y,ne,de,ye,xe,Z.image.data):Z.isCompressedTexture?K.compressedTexSubImage2D(K.TEXTURE_2D,ae,C.x,C.y,Z.mipmaps[0].width,Z.mipmaps[0].height,ye,Z.mipmaps[0].data):K.texSubImage2D(K.TEXTURE_2D,ae,C.x,C.y,ye,xe,Z.image),ae===0&&te.generateMipmaps&&K.generateMipmap(K.TEXTURE_2D),S.unbindTexture()},this.copyTextureToTexture3D=function(C,Z,te,ae,ne=0){if(v.isWebGL1Renderer)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");let de=C.max.x-C.min.x+1,ye=C.max.y-C.min.y+1,xe=C.max.z-C.min.z+1,Ae=At.convert(ae.format),Ce=At.convert(ae.type),Pe;if(ae.isData3DTexture)Y.setTexture3D(ae,0),Pe=K.TEXTURE_3D;else{if(!ae.isDataArrayTexture&&!ae.isCompressedArrayTexture)return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");Y.setTexture2DArray(ae,0),Pe=K.TEXTURE_2D_ARRAY}K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,ae.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ae.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,ae.unpackAlignment);let Ue=K.getParameter(K.UNPACK_ROW_LENGTH),Ve=K.getParameter(K.UNPACK_IMAGE_HEIGHT),zt=K.getParameter(K.UNPACK_SKIP_PIXELS),Jt=K.getParameter(K.UNPACK_SKIP_ROWS),bi=K.getParameter(K.UNPACK_SKIP_IMAGES),We=te.isCompressedTexture?te.mipmaps[ne]:te.image;K.pixelStorei(K.UNPACK_ROW_LENGTH,We.width),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,We.height),K.pixelStorei(K.UNPACK_SKIP_PIXELS,C.min.x),K.pixelStorei(K.UNPACK_SKIP_ROWS,C.min.y),K.pixelStorei(K.UNPACK_SKIP_IMAGES,C.min.z),te.isDataTexture||te.isData3DTexture?K.texSubImage3D(Pe,ne,Z.x,Z.y,Z.z,de,ye,xe,Ae,Ce,We.data):te.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),K.compressedTexSubImage3D(Pe,ne,Z.x,Z.y,Z.z,de,ye,xe,Ae,We.data)):K.texSubImage3D(Pe,ne,Z.x,Z.y,Z.z,de,ye,xe,Ae,Ce,We),K.pixelStorei(K.UNPACK_ROW_LENGTH,Ue),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,Ve),K.pixelStorei(K.UNPACK_SKIP_PIXELS,zt),K.pixelStorei(K.UNPACK_SKIP_ROWS,Jt),K.pixelStorei(K.UNPACK_SKIP_IMAGES,bi),ne===0&&ae.generateMipmaps&&K.generateMipmap(Pe),S.unbindTexture()},this.initTexture=function(C){C.isCubeTexture?Y.setTextureCube(C,0):C.isData3DTexture?Y.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?Y.setTexture2DArray(C,0):Y.setTexture2D(C,0),S.unbindTexture()},this.resetState=function(){R=0,M=0,A=null,S.reset(),Mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===Mo?"display-p3":"srgb",t.unpackColorSpace=Be.workingColorSpace===Ms?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Je?Bi:Ic}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Bi?Je:si}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}},Ga=class extends $n{};Ga.prototype.isWebGL1Renderer=!0;var os=class extends vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}};var _p=new w;var vp=new w,yp=new w,xp=new w,Mp=new le,Sp=new le,bp=new we,Ep=new w,Tp=new w,wp=new w,Ap=new le,Rp=new le,Cp=new le;var Lp=new w,Pp=new w;var Ip=new w,Up=new Ye,Dp=new Ye,Np=new w,Op=new we,Fp=new w,Bp=new Zt,zp=new we,Hp=new vn;var ls=class extends It{constructor(e=null,t=1,i=1,n,s,a,o,l,c=1003,h=1003,u,d){super(null,a,o,l,c,h,n,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},kp=new we,Gp=new we;var Vp=new we,Wp=new we;var Xp=new Dt,jp=new we,qp=new Se,Yp=new Zt;var Va=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t){let i=this.pool,n=this.list;this.index>=i.length&&i.push({start:-1,count:-1,z:-1});let s=i[this.index];n.push(s),this.index++,s.start=e.start,s.count=e.count,s.z=t}reset(){this.list.length=0,this.index=0}};var Zp=new we,Jp=new we,Kp=new we,$p=new we,Qp=new En,em=new Dt,tm=new Zt,im=new w,nm=new Va,rm=new Se;var sm=new w,am=new w,om=new we,lm=new vn,cm=new Zt;var hm=new w,um=new w;var dm=new we,pm=new vn,mm=new Zt,fm=new w;var Nt=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,n=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(n),t.push(s),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let i=this.getLengths(),n=0,s=i.length,a;a=t||e*i[s-1];let o,l=0,c=s-1;for(;l<=c;)if(n=Math.floor(l+(c-l)/2),o=i[n]-a,o<0)l=n+1;else{if(!(o>0)){c=n;break}c=n-1}if(n=c,i[n]===a)return n/(s-1);let h=i[n];return(n+(a-h)/(i[n+1]-h))/(s-1)}getTangent(e,t){let n=e-1e-4,s=e+1e-4;n<0&&(n=0),s>1&&(s=1);let a=this.getPoint(n),o=this.getPoint(s),l=t||(a.isVector2?new le:new w);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){let i=new w,n=[],s=[],a=[],o=new w,l=new we;for(let p=0;p<=e;p++){let g=p/e;n[p]=this.getTangentAt(g,new w)}s[0]=new w,a[0]=new w;let c=Number.MAX_VALUE,h=Math.abs(n[0].x),u=Math.abs(n[0].y),d=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),a[0].crossVectors(n[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(n[p-1],n[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(rt(n[p-1].dot(n[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(n[p],s[p])}if(t===!0){let p=Math.acos(rt(s[0].dot(s[e]),-1,1));p/=e,n[0].dot(o.crossVectors(s[0],s[e]))>0&&(p=-p);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(n[g],p*g)),a[g].crossVectors(n[g],s[g])}return{tangents:n,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Qn=class extends Nt{constructor(e=0,t=0,i=1,n=1,s=0,a=2*Math.PI,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t){let i=t||new le,n=2*Math.PI,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(s=a?0:n),this.aClockwise!==!0||a||(s===n?s=-n:s-=n);let o=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Wa=class extends Qn{constructor(e,t,i,n,s,a){super(e,t,i,i,n,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function bo(){let r=0,e=0,t=0,i=0;function n(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){n(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,u){let d=(a-s)/c-(o-s)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,p*=h,n(a,o,d,p)},calc:function(s){let a=s*s;return r+e*s+t*a+i*(a*s)}}}var Fr=new w,da=new bo,pa=new bo,ma=new bo,er=class extends Nt{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new w){let i=t,n=this.points,s=n.length,a=(s-(this.closed?0:1))*e,o,l,c=Math.floor(a),h=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:h===0&&c===s-1&&(c=s-2,h=1),this.closed||c>0?o=n[(c-1)%s]:(Fr.subVectors(n[0],n[1]).add(n[0]),o=Fr);let u=n[c%s],d=n[(c+1)%s];if(this.closed||c+2<s?l=n[(c+2)%s]:(Fr.subVectors(n[s-1],n[s-2]).add(n[s-1]),l=Fr),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(o.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(l),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),da.initNonuniformCatmullRom(o.x,u.x,d.x,l.x,g,_,m),pa.initNonuniformCatmullRom(o.y,u.y,d.y,l.y,g,_,m),ma.initNonuniformCatmullRom(o.z,u.z,d.z,l.z,g,_,m)}else this.curveType==="catmullrom"&&(da.initCatmullRom(o.x,u.x,d.x,l.x,this.tension),pa.initCatmullRom(o.y,u.y,d.y,l.y,this.tension),ma.initCatmullRom(o.z,u.z,d.z,l.z,this.tension));return i.set(da.calc(h),pa.calc(h),ma.calc(h)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new w().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function mc(r,e,t,i,n){let s=.5*(i-e),a=.5*(n-t),o=r*r;return(2*t-2*i+s+a)*(r*o)+(-3*t+3*i-2*s-a)*o+s*r+t}function qn(r,e,t,i){return function(n,s){let a=1-n;return a*a*s}(r,e)+function(n,s){return 2*(1-n)*n*s}(r,t)+function(n,s){return n*n*s}(r,i)}function Yn(r,e,t,i,n){return function(s,a){let o=1-s;return o*o*o*a}(r,e)+function(s,a){let o=1-s;return 3*o*o*s*a}(r,t)+function(s,a){return 3*(1-s)*s*s*a}(r,i)+function(s,a){return s*s*s*a}(r,n)}var cs=class extends Nt{constructor(e=new le,t=new le,i=new le,n=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new le){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(Yn(e,n.x,s.x,a.x,o.x),Yn(e,n.y,s.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xa=class extends Nt{constructor(e=new w,t=new w,i=new w,n=new w){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new w){let i=t,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(Yn(e,n.x,s.x,a.x,o.x),Yn(e,n.y,s.y,a.y,o.y),Yn(e,n.z,s.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},hs=class extends Nt{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ja=class extends Nt{constructor(e=new w,t=new w){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new w){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new w){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},us=class extends Nt{constructor(e=new le,t=new le,i=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new le){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(qn(e,n.x,s.x,a.x),qn(e,n.y,s.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ds=class extends Nt{constructor(e=new w,t=new w,i=new w){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new w){let i=t,n=this.v0,s=this.v1,a=this.v2;return i.set(qn(e,n.x,s.x,a.x),qn(e,n.y,s.y,a.y),qn(e,n.z,s.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ps=class extends Nt{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){let i=t,n=this.points,s=(n.length-1)*e,a=Math.floor(s),o=s-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],u=n[a>n.length-3?n.length-1:a+2];return i.set(mc(o,l.x,c.x,h.x,u.x),mc(o,l.y,c.y,h.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let n=e.points[t];this.points.push(new le().fromArray(n))}return this}},ms=Object.freeze({__proto__:null,ArcCurve:Wa,CatmullRomCurve3:er,CubicBezierCurve:cs,CubicBezierCurve3:Xa,EllipseCurve:Qn,LineCurve:hs,LineCurve3:ja,QuadraticBezierCurve:us,QuadraticBezierCurve3:ds,SplineCurve:ps}),qa=class extends Nt{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ms[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),n=this.getCurveLengths(),s=0;for(;s<n.length;){if(n[s]>=i){let a=n[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let n=0,s=this.curves;n<s.length;n++){let a=s[n],o=a.isEllipseCurve?2*e:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let n=e.curves[t];this.curves.push(new ms[n.type]().fromJSON(n))}return this}},tr=class extends qa{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new hs(this.currentPoint.clone(),new le(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){let s=new us(this.currentPoint.clone(),new le(e,t),new le(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,s,a){let o=new cs(this.currentPoint.clone(),new le(e,t),new le(i,n),new le(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new ps(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,n,s,a),this}absarc(e,t,i,n,s,a){return this.absellipse(e,t,i,i,n,s,a),this}ellipse(e,t,i,n,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,n,s,a,o,l),this}absellipse(e,t,i,n,s,a,o,l){let c=new Qn(e,t,i,n,s,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},fs=class r extends Ge{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,i=0,n=2*Math.PI){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:n},t=Math.floor(t),n=rt(n,0,2*Math.PI);let s=[],a=[],o=[],l=[],c=[],h=1/t,u=new w,d=new le,p=new w,g=new w,_=new w,m=0,y=0;for(let f=0;f<=e.length-1;f++)switch(f){case 0:m=e[f+1].x-e[f].x,y=e[f+1].y-e[f].y,p.x=1*y,p.y=-m,p.z=0*y,_.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:m=e[f+1].x-e[f].x,y=e[f+1].y-e[f].y,p.x=1*y,p.y=-m,p.z=0*y,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),l.push(p.x,p.y,p.z),_.copy(g)}for(let f=0;f<=t;f++){let v=i+f*h*n,b=Math.sin(v),R=Math.cos(v);for(let M=0;M<=e.length-1;M++){u.x=e[M].x*b,u.y=e[M].y,u.z=e[M].x*R,a.push(u.x,u.y,u.z),d.x=f/t,d.y=M/(e.length-1),o.push(d.x,d.y);let A=l[3*M+0]*b,U=l[3*M+1],P=l[3*M+0]*R;c.push(A,U,P)}}for(let f=0;f<t;f++)for(let v=0;v<e.length-1;v++){let b=v+f*e.length,R=b,M=b+e.length,A=b+e.length+1,U=b+1;s.push(R,M,U),s.push(A,U,M)}this.setIndex(s),this.setAttribute("position",new ve(a,3)),this.setAttribute("uv",new ve(o,2)),this.setAttribute("normal",new ve(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},Ot=class r extends fs{constructor(e=1,t=1,i=4,n=8){let s=new tr;s.absarc(0,-t/2,e,1.5*Math.PI,0),s.absarc(0,t/2,e,0,.5*Math.PI),super(s.getPoints(i),n),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:i,radialSegments:n}}static fromJSON(e){return new r(e.radius,e.length,e.capSegments,e.radialSegments)}},wn=class r extends Ge{constructor(e=1,t=32,i=0,n=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);let s=[],a=[],o=[],l=[],c=new w,h=new le;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=i+u/t*n;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new ve(a,3)),this.setAttribute("normal",new ve(o,3)),this.setAttribute("uv",new ve(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},pt=class r extends Ge{constructor(e=1,t=1,i=1,n=32,s=1,a=!1,o=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;n=Math.floor(n),s=Math.floor(s);let h=[],u=[],d=[],p=[],g=0,_=[],m=i/2,y=0;function f(v){let b=g,R=new le,M=new w,A=0,U=v===!0?e:t,P=v===!0?1:-1;for(let G=1;G<=n;G++)u.push(0,m*P,0),d.push(0,P,0),p.push(.5,.5),g++;let B=g;for(let G=0;G<=n;G++){let x=G/n*l+o,I=Math.cos(x),L=Math.sin(x);M.x=U*L,M.y=m*P,M.z=U*I,u.push(M.x,M.y,M.z),d.push(0,P,0),R.x=.5*I+.5,R.y=.5*L*P+.5,p.push(R.x,R.y),g++}for(let G=0;G<n;G++){let x=b+G,I=B+G;v===!0?h.push(I,I+1,x):h.push(I+1,I,x),A+=3}c.addGroup(y,A,v===!0?1:2),y+=A}(function(){let v=new w,b=new w,R=0,M=(t-e)/i;for(let A=0;A<=s;A++){let U=[],P=A/s,B=P*(t-e)+e;for(let G=0;G<=n;G++){let x=G/n,I=x*l+o,L=Math.sin(I),F=Math.cos(I);b.x=B*L,b.y=-P*i+m,b.z=B*F,u.push(b.x,b.y,b.z),v.set(L,M,F).normalize(),d.push(v.x,v.y,v.z),p.push(x,1-P),U.push(g++)}_.push(U)}for(let A=0;A<n;A++)for(let U=0;U<s;U++){let P=_[U][A],B=_[U+1][A],G=_[U+1][A+1],x=_[U][A+1];h.push(P,B,x),h.push(B,G,x),R+=6}c.addGroup(y,R,0),y+=R})(),a===!1&&(e>0&&f(!0),t>0&&f(!1)),this.setIndex(h),this.setAttribute("position",new ve(u,3)),this.setAttribute("normal",new ve(d,3)),this.setAttribute("uv",new ve(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},An=class r extends pt{constructor(e=1,t=1,i=32,n=1,s=!1,a=0,o=2*Math.PI){super(0,e,t,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Hi=class r extends Ge{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};let s=[],a=[];function o(d,p,g,_){let m=_+1,y=[];for(let f=0;f<=m;f++){y[f]=[];let v=d.clone().lerp(g,f/m),b=p.clone().lerp(g,f/m),R=m-f;for(let M=0;M<=R;M++)y[f][M]=M===0&&f===m?v:v.clone().lerp(b,M/R)}for(let f=0;f<m;f++)for(let v=0;v<2*(m-f)-1;v++){let b=Math.floor(v/2);v%2==0?(l(y[f][b+1]),l(y[f+1][b]),l(y[f][b])):(l(y[f][b+1]),l(y[f+1][b+1]),l(y[f+1][b]))}}function l(d){s.push(d.x,d.y,d.z)}function c(d,p){let g=3*d;p.x=e[g+0],p.y=e[g+1],p.z=e[g+2]}function h(d,p,g,_){_<0&&d.x===1&&(a[p]=d.x-1),g.x===0&&g.z===0&&(a[p]=_/2/Math.PI+.5)}function u(d){return Math.atan2(d.z,-d.x)}(function(d){let p=new w,g=new w,_=new w;for(let m=0;m<t.length;m+=3)c(t[m+0],p),c(t[m+1],g),c(t[m+2],_),o(p,g,_,d)})(n),function(d){let p=new w;for(let g=0;g<s.length;g+=3)p.x=s[g+0],p.y=s[g+1],p.z=s[g+2],p.normalize().multiplyScalar(d),s[g+0]=p.x,s[g+1]=p.y,s[g+2]=p.z}(i),function(){let d=new w;for(let g=0;g<s.length;g+=3){d.x=s[g+0],d.y=s[g+1],d.z=s[g+2];let _=u(d)/2/Math.PI+.5,m=(p=d,Math.atan2(-p.y,Math.sqrt(p.x*p.x+p.z*p.z))/Math.PI+.5);a.push(_,1-m)}var p;(function(){let g=new w,_=new w,m=new w,y=new w,f=new le,v=new le,b=new le;for(let R=0,M=0;R<s.length;R+=9,M+=6){g.set(s[R+0],s[R+1],s[R+2]),_.set(s[R+3],s[R+4],s[R+5]),m.set(s[R+6],s[R+7],s[R+8]),f.set(a[M+0],a[M+1]),v.set(a[M+2],a[M+3]),b.set(a[M+4],a[M+5]),y.copy(g).add(_).add(m).divideScalar(3);let A=u(y);h(f,M+0,g,A),h(v,M+2,_,A),h(b,M+4,m,A)}})(),function(){for(let g=0;g<a.length;g+=6){let _=a[g+0],m=a[g+2],y=a[g+4],f=Math.max(_,m,y),v=Math.min(_,m,y);f>.9&&v<.1&&(_<.2&&(a[g+0]+=1),m<.2&&(a[g+2]+=1),y<.2&&(a[g+4]+=1))}}()}(),this.setAttribute("position",new ve(s,3)),this.setAttribute("normal",new ve(s.slice(),3)),this.setAttribute("uv",new ve(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},Ya=class r extends Hi{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,n=1/i;super([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Br=new w,zr=new w,fa=new w,Hr=new Di,Za=class extends Ge{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let n=Math.pow(10,4),s=Math.cos(Wr*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},p=[];for(let g=0;g<l;g+=3){a?(c[0]=a.getX(g),c[1]=a.getX(g+1),c[2]=a.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:_,b:m,c:y}=Hr;if(_.fromBufferAttribute(o,c[0]),m.fromBufferAttribute(o,c[1]),y.fromBufferAttribute(o,c[2]),Hr.getNormal(fa),u[0]=`${Math.round(_.x*n)},${Math.round(_.y*n)},${Math.round(_.z*n)}`,u[1]=`${Math.round(m.x*n)},${Math.round(m.y*n)},${Math.round(m.z*n)}`,u[2]=`${Math.round(y.x*n)},${Math.round(y.y*n)},${Math.round(y.z*n)}`,u[0]!==u[1]&&u[1]!==u[2]&&u[2]!==u[0])for(let f=0;f<3;f++){let v=(f+1)%3,b=u[f],R=u[v],M=Hr[h[f]],A=Hr[h[v]],U=`${b}_${R}`,P=`${R}_${b}`;P in d&&d[P]?(fa.dot(d[P].normal)<=s&&(p.push(M.x,M.y,M.z),p.push(A.x,A.y,A.z)),d[P]=null):U in d||(d[U]={index0:c[f],index1:c[v],normal:fa.clone()})}}for(let g in d)if(d[g]){let{index0:_,index1:m}=d[g];Br.fromBufferAttribute(o,_),zr.fromBufferAttribute(o,m),p.push(Br.x,Br.y,Br.z),p.push(zr.x,zr.y,zr.z)}this.setAttribute("position",new ve(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},gs=class extends tr{constructor(e){super(e),this.uuid=Ln(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,n=this.holes.length;i<n;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let n=e.holes[t];this.holes.push(new tr().fromJSON(n))}return this}},Rd=function(r,e,t=2){let i=e&&e.length,n=i?e[0]*t:r.length,s=fc(r,0,n,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,u,d,p;if(i&&(s=function(g,_,m,y){let f=[],v,b,R,M,A;for(v=0,b=_.length;v<b;v++)R=_[v]*y,M=v<b-1?_[v+1]*y:g.length,A=fc(g,R,M,y,!1),A===A.next&&(A.steiner=!0),f.push(Od(A));for(f.sort(Ud),v=0;v<f.length;v++)m=Dd(f[v],m);return m}(r,e,s,t)),r.length>80*t){o=c=r[0],l=h=r[1];for(let g=t;g<n;g+=t)u=r[g],d=r[g+1],u<o&&(o=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);p=Math.max(c-o,h-l),p=p!==0?32767/p:0}return ir(s,a,t,o,l,p,0),a};function fc(r,e,t,i,n){let s,a;if(n===function(o,l,c,h){let u=0;for(let d=l,p=c-h;d<c;d+=h)u+=(o[p]-o[d])*(o[d+1]+o[p+1]),p=d;return u}(r,e,t,i)>0)for(s=e;s<t;s+=i)a=gc(s,r[s],r[s+1],a);else for(s=t-i;s>=e;s-=i)a=gc(s,r[s],r[s+1],a);return a&&bs(a,a.next)&&(rr(a),a=a.next),a}function ki(r,e){if(!r)return r;e||(e=r);let t,i=r;do if(t=!1,i.steiner||!bs(i,i.next)&&Xe(i.prev,i,i.next)!==0)i=i.next;else{if(rr(i),i=e=i.prev,i===i.next)break;t=!0}while(t||i!==e);return e}function ir(r,e,t,i,n,s,a){if(!r)return;!a&&s&&function(h,u,d,p){let g=h;do g.z===0&&(g.z=Ja(g.x,g.y,u,d,p)),g.prevZ=g.prev,g.nextZ=g.next,g=g.next;while(g!==h);g.prevZ.nextZ=null,g.prevZ=null,function(_){let m,y,f,v,b,R,M,A,U=1;do{for(y=_,_=null,b=null,R=0;y;){for(R++,f=y,M=0,m=0;m<U&&(M++,f=f.nextZ,f);m++);for(A=U;M>0||A>0&&f;)M!==0&&(A===0||!f||y.z<=f.z)?(v=y,y=y.nextZ,M--):(v=f,f=f.nextZ,A--),b?b.nextZ=v:_=v,v.prevZ=b,b=v;y=f}b.nextZ=null,U*=2}while(R>1)}(g)}(r,i,n,s);let o,l,c=r;for(;r.prev!==r.next;)if(o=r.prev,l=r.next,s?Ld(r,i,n,s):Cd(r))e.push(o.i/t|0),e.push(r.i/t|0),e.push(l.i/t|0),rr(r),r=l.next,c=l.next;else if((r=l)===c){a?a===1?ir(r=Pd(ki(r),e,t),e,t,i,n,s,2):a===2&&Id(r,e,t,i,n,s):ir(ki(r),e,t,i,n,s,1);break}}function Cd(r){let e=r.prev,t=r,i=r.next;if(Xe(e,t,i)>=0)return!1;let n=e.x,s=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=n<s?n<a?n:a:s<a?s:a,u=o<l?o<c?o:c:l<c?l:c,d=n>s?n>a?n:a:s>a?s:a,p=o>l?o>c?o:c:l>c?l:c,g=i.next;for(;g!==e;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&un(n,o,s,l,a,c,g.x,g.y)&&Xe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Ld(r,e,t,i){let n=r.prev,s=r,a=r.next;if(Xe(n,s,a)>=0)return!1;let o=n.x,l=s.x,c=a.x,h=n.y,u=s.y,d=a.y,p=o<l?o<c?o:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,_=o>l?o>c?o:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,y=Ja(p,g,e,t,i),f=Ja(_,m,e,t,i),v=r.prevZ,b=r.nextZ;for(;v&&v.z>=y&&b&&b.z<=f;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==n&&v!==a&&un(o,h,l,u,c,d,v.x,v.y)&&Xe(v.prev,v,v.next)>=0||(v=v.prevZ,b.x>=p&&b.x<=_&&b.y>=g&&b.y<=m&&b!==n&&b!==a&&un(o,h,l,u,c,d,b.x,b.y)&&Xe(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;v&&v.z>=y;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==n&&v!==a&&un(o,h,l,u,c,d,v.x,v.y)&&Xe(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;b&&b.z<=f;){if(b.x>=p&&b.x<=_&&b.y>=g&&b.y<=m&&b!==n&&b!==a&&un(o,h,l,u,c,d,b.x,b.y)&&Xe(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Pd(r,e,t){let i=r;do{let n=i.prev,s=i.next.next;!bs(n,s)&&Gc(n,i,i.next,s)&&nr(n,s)&&nr(s,n)&&(e.push(n.i/t|0),e.push(i.i/t|0),e.push(s.i/t|0),rr(i),rr(i.next),i=r=s),i=i.next}while(i!==r);return ki(i)}function Id(r,e,t,i,n,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Fd(a,o)){let l=Vc(a,o);return a=ki(a,a.next),l=ki(l,l.next),ir(a,e,t,i,n,s,0),void ir(l,e,t,i,n,s,0)}o=o.next}a=a.next}while(a!==r)}function Ud(r,e){return r.x-e.x}function Dd(r,e){let t=function(n,s){let a,o=s,l=-1/0,c=n.x,h=n.y;do{if(h<=o.y&&h>=o.next.y&&o.next.y!==o.y){let m=o.x+(h-o.y)*(o.next.x-o.x)/(o.next.y-o.y);if(m<=c&&m>l&&(l=m,a=o.x<o.next.x?o:o.next,m===c))return a}o=o.next}while(o!==s);if(!a)return null;let u=a,d=a.x,p=a.y,g,_=1/0;o=a;do c>=o.x&&o.x>=d&&c!==o.x&&un(h<p?c:l,h,d,p,h<p?l:c,h,o.x,o.y)&&(g=Math.abs(h-o.y)/(c-o.x),nr(o,n)&&(g<_||g===_&&(o.x>a.x||o.x===a.x&&Nd(a,o)))&&(a=o,_=g)),o=o.next;while(o!==u);return a}(r,e);if(!t)return e;let i=Vc(t,r);return ki(i,i.next),ki(t,t.next)}function Nd(r,e){return Xe(r.prev,r,e.prev)<0&&Xe(e.next,r,r.next)<0}function Ja(r,e,t,i,n){return(r=1431655765&((r=858993459&((r=252645135&((r=16711935&((r=(r-t)*n|0)|r<<8))|r<<4))|r<<2))|r<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-i)*n|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function Od(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function un(r,e,t,i,n,s,a,o){return(n-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(n-a)*(i-o)}function Fd(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!function(t,i){let n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==i.i&&n.next.i!==i.i&&Gc(n,n.next,t,i))return!0;n=n.next}while(n!==t);return!1}(r,e)&&(nr(r,e)&&nr(e,r)&&function(t,i){let n=t,s=!1,a=(t.x+i.x)/2,o=(t.y+i.y)/2;do n.y>o!=n.next.y>o&&n.next.y!==n.y&&a<(n.next.x-n.x)*(o-n.y)/(n.next.y-n.y)+n.x&&(s=!s),n=n.next;while(n!==t);return s}(r,e)&&(Xe(r.prev,r,e.prev)||Xe(r,e.prev,e))||bs(r,e)&&Xe(r.prev,r,r.next)>0&&Xe(e.prev,e,e.next)>0)}function Xe(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function bs(r,e){return r.x===e.x&&r.y===e.y}function Gc(r,e,t,i){let n=Gr(Xe(r,e,t)),s=Gr(Xe(r,e,i)),a=Gr(Xe(t,i,r)),o=Gr(Xe(t,i,e));return n!==s&&a!==o||!(n!==0||!kr(r,t,e))||!(s!==0||!kr(r,i,e))||!(a!==0||!kr(t,r,i))||!(o!==0||!kr(t,e,i))}function kr(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Gr(r){return r>0?1:r<0?-1:0}function nr(r,e){return Xe(r.prev,r,r.next)<0?Xe(r,e,r.next)>=0&&Xe(r,r.prev,e)>=0:Xe(r,e,r.prev)<0||Xe(r,r.next,e)<0}function Vc(r,e){let t=new Ka(r.i,r.x,r.y),i=new Ka(e.i,e.x,e.y),n=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=n,n.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function gc(r,e,t,i){let n=new Ka(r,e,t);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function rr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Ka(r,e,t){this.i=r,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}var vi=class r{static area(e){let t=e.length,i=0;for(let n=t-1,s=0;s<t;n=s++)i+=e[n].x*e[s].y-e[s].x*e[n].y;return .5*i}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let i=[],n=[],s=[];_c(e),vc(i,e);let a=e.length;t.forEach(_c);for(let l=0;l<t.length;l++)n.push(a),a+=t[l].length,vc(i,t[l]);let o=Rd(i,n);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};function _c(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function vc(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var $a=class r extends Ge{constructor(e=new gs([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,n=[],s=[];for(let o=0,l=e.length;o<l;o++)a(e[o]);function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled===void 0||t.bevelEnabled,p=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:p-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,y=t.extrudePath,f=t.UVGenerator!==void 0?t.UVGenerator:Bd,v,b,R,M,A,U=!1;y&&(v=y.getSpacedPoints(h),U=!0,d=!1,b=y.computeFrenetFrames(h,!1),R=new w,M=new w,A=new w),d||(m=0,p=0,g=0,_=0);let P=o.extractPoints(c),B=P.shape,G=P.holes;if(!vi.isClockWise(B)){B=B.reverse();for(let O=0,N=G.length;O<N;O++){let W=G[O];vi.isClockWise(W)&&(G[O]=W.reverse())}}let x=vi.triangulateShape(B,G),I=B;for(let O=0,N=G.length;O<N;O++){let W=G[O];B=B.concat(W)}function L(O,N,W){return N||console.error("THREE.ExtrudeGeometry: vec does not exist"),O.clone().addScaledVector(N,W)}let F=B.length,ie=x.length;function k(O,N,W){let ee,$,S,re=O.x-N.x,j=O.y-N.y,Y=W.x-O.x,se=W.y-O.y,ue=re*re+j*j,pe=re*se-j*Y;if(Math.abs(pe)>Number.EPSILON){let me=Math.sqrt(ue),Me=Math.sqrt(Y*Y+se*se),fe=N.x-j/me,ge=N.y+re/me,Te=((W.x-se/Me-fe)*se-(W.y+Y/Me-ge)*Y)/(re*se-j*Y);ee=fe+re*Te-O.x,$=ge+j*Te-O.y;let et=ee*ee+$*$;if(et<=2)return new le(ee,$);S=Math.sqrt(et/2)}else{let me=!1;re>Number.EPSILON?Y>Number.EPSILON&&(me=!0):re<-Number.EPSILON?Y<-Number.EPSILON&&(me=!0):Math.sign(j)===Math.sign(se)&&(me=!0),me?(ee=-j,$=re,S=Math.sqrt(ue)):(ee=re,$=j,S=Math.sqrt(ue/2))}return new le(ee/S,$/S)}let H=[];for(let O=0,N=I.length,W=N-1,ee=O+1;O<N;O++,W++,ee++)W===N&&(W=0),ee===N&&(ee=0),H[O]=k(I[O],I[W],I[ee]);let X=[],z,q=H.concat();for(let O=0,N=G.length;O<N;O++){let W=G[O];z=[];for(let ee=0,$=W.length,S=$-1,re=ee+1;ee<$;ee++,S++,re++)S===$&&(S=0),re===$&&(re=0),z[ee]=k(W[ee],W[S],W[re]);X.push(z),q=q.concat(z)}for(let O=0;O<m;O++){let N=O/m,W=p*Math.cos(N*Math.PI/2),ee=g*Math.sin(N*Math.PI/2)+_;for(let $=0,S=I.length;$<S;$++){let re=L(I[$],H[$],ee);T(re.x,re.y,-W)}for(let $=0,S=G.length;$<S;$++){let re=G[$];z=X[$];for(let j=0,Y=re.length;j<Y;j++){let se=L(re[j],z[j],ee);T(se.x,se.y,-W)}}}let oe=g+_;for(let O=0;O<F;O++){let N=d?L(B[O],q[O],oe):B[O];U?(M.copy(b.normals[0]).multiplyScalar(N.x),R.copy(b.binormals[0]).multiplyScalar(N.y),A.copy(v[0]).add(M).add(R),T(A.x,A.y,A.z)):T(N.x,N.y,0)}for(let O=1;O<=h;O++)for(let N=0;N<F;N++){let W=d?L(B[N],q[N],oe):B[N];U?(M.copy(b.normals[O]).multiplyScalar(W.x),R.copy(b.binormals[O]).multiplyScalar(W.y),A.copy(v[O]).add(M).add(R),T(A.x,A.y,A.z)):T(W.x,W.y,u/h*O)}for(let O=m-1;O>=0;O--){let N=O/m,W=p*Math.cos(N*Math.PI/2),ee=g*Math.sin(N*Math.PI/2)+_;for(let $=0,S=I.length;$<S;$++){let re=L(I[$],H[$],ee);T(re.x,re.y,u+W)}for(let $=0,S=G.length;$<S;$++){let re=G[$];z=X[$];for(let j=0,Y=re.length;j<Y;j++){let se=L(re[j],z[j],ee);U?T(se.x,se.y+v[h-1].y,v[h-1].x+W):T(se.x,se.y,u+W)}}}function E(O,N){let W=O.length;for(;--W>=0;){let ee=W,$=W-1;$<0&&($=O.length-1);for(let S=0,re=h+2*m;S<re;S++){let j=F*S,Y=F*(S+1);Q(N+ee+j,N+$+j,N+$+Y,N+ee+Y)}}}function T(O,N,W){l.push(O),l.push(N),l.push(W)}function V(O,N,W){D(O),D(N),D(W);let ee=n.length/3,$=f.generateTopUV(i,n,ee-3,ee-2,ee-1);J($[0]),J($[1]),J($[2])}function Q(O,N,W,ee){D(O),D(N),D(ee),D(N),D(W),D(ee);let $=n.length/3,S=f.generateSideWallUV(i,n,$-6,$-3,$-2,$-1);J(S[0]),J(S[1]),J(S[3]),J(S[1]),J(S[2]),J(S[3])}function D(O){n.push(l[3*O+0]),n.push(l[3*O+1]),n.push(l[3*O+2])}function J(O){s.push(O.x),s.push(O.y)}(function(){let O=n.length/3;if(d){let N=0,W=F*N;for(let ee=0;ee<ie;ee++){let $=x[ee];V($[2]+W,$[1]+W,$[0]+W)}N=h+2*m,W=F*N;for(let ee=0;ee<ie;ee++){let $=x[ee];V($[0]+W,$[1]+W,$[2]+W)}}else{for(let N=0;N<ie;N++){let W=x[N];V(W[2],W[1],W[0])}for(let N=0;N<ie;N++){let W=x[N];V(W[0]+F*h,W[1]+F*h,W[2]+F*h)}}i.addGroup(O,n.length/3-O,0)})(),function(){let O=n.length/3,N=0;E(I,N),N+=I.length;for(let W=0,ee=G.length;W<ee;W++){let $=G[W];E($,N),N+=$.length}i.addGroup(O,n.length/3-O,1)}()}this.setAttribute("position",new ve(n,3)),this.setAttribute("uv",new ve(s,2)),this.computeVertexNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return function(t,i,n){if(n.shapes=[],Array.isArray(t))for(let s=0,a=t.length;s<a;s++){let o=t[s];n.shapes.push(o.uuid)}else n.shapes.push(t.uuid);return n.options=Object.assign({},i),i.extrudePath!==void 0&&(n.options.extrudePath=i.extrudePath.toJSON()),n}(this.parameters.shapes,this.parameters.options,e)}static fromJSON(e,t){let i=[];for(let s=0,a=e.shapes.length;s<a;s++){let o=t[e.shapes[s]];i.push(o)}let n=e.options.extrudePath;return n!==void 0&&(e.options.extrudePath=new ms[n.type]().fromJSON(n)),new r(i,e.options)}},Bd={generateTopUV:function(r,e,t,i,n){let s=e[3*t],a=e[3*t+1],o=e[3*i],l=e[3*i+1],c=e[3*n],h=e[3*n+1];return[new le(s,a),new le(o,l),new le(c,h)]},generateSideWallUV:function(r,e,t,i,n,s){let a=e[3*t],o=e[3*t+1],l=e[3*t+2],c=e[3*i],h=e[3*i+1],u=e[3*i+2],d=e[3*n],p=e[3*n+1],g=e[3*n+2],_=e[3*s],m=e[3*s+1],y=e[3*s+2];return Math.abs(o-h)<Math.abs(a-c)?[new le(a,1-l),new le(c,1-u),new le(d,1-g),new le(_,1-y)]:[new le(o,1-l),new le(h,1-u),new le(p,1-g),new le(m,1-y)]}},Qa=class r extends Hi{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2;super([-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},eo=class r extends Hi{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},to=class r extends Ge{constructor(e=.5,t=1,i=32,n=1,s=0,a=2*Math.PI){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/(n=Math.max(1,n)),p=new w,g=new le;for(let _=0;_<=n;_++){for(let m=0;m<=i;m++){let y=s+m/i*a;p.x=u*Math.cos(y),p.y=u*Math.sin(y),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<n;_++){let m=_*(i+1);for(let y=0;y<i;y++){let f=y+m,v=f,b=f+i+1,R=f+i+2,M=f+1;o.push(v,b,M),o.push(b,R,M)}}this.setIndex(o),this.setAttribute("position",new ve(l,3)),this.setAttribute("normal",new ve(c,3)),this.setAttribute("uv",new ve(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},io=class r extends Ge{constructor(e=new gs([new le(0,.5),new le(-.5,-.5),new le(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],n=[],s=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;function c(h){let u=n.length/3,d=h.extractPoints(t),p=d.shape,g=d.holes;vi.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,y=g.length;m<y;m++){let f=g[m];vi.isClockWise(f)===!0&&(g[m]=f.reverse())}let _=vi.triangulateShape(p,g);for(let m=0,y=g.length;m<y;m++){let f=g[m];p=p.concat(f)}for(let m=0,y=p.length;m<y;m++){let f=p[m];n.push(f.x,f.y,0),s.push(0,0,1),a.push(f.x,f.y)}for(let m=0,y=_.length;m<y;m++){let f=_[m],v=f[0]+u,b=f[1]+u,R=f[2]+u;i.push(v,b,R),l+=3}}this.setIndex(i),this.setAttribute("position",new ve(n,3)),this.setAttribute("normal",new ve(s,3)),this.setAttribute("uv",new ve(a,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return function(t,i){if(i.shapes=[],Array.isArray(t))for(let n=0,s=t.length;n<s;n++){let a=t[n];i.shapes.push(a.uuid)}else i.shapes.push(t.uuid);return i}(this.parameters.shapes,e)}static fromJSON(e,t){let i=[];for(let n=0,s=e.shapes.length;n<s;n++){let a=t[e.shapes[n]];i.push(a)}return new r(i,e.curveSegments)}},it=class r extends Ge{constructor(e=1,t=32,i=16,n=0,s=2*Math.PI,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new w,d=new w,p=[],g=[],_=[],m=[];for(let y=0;y<=i;y++){let f=[],v=y/i,b=0;y===0&&a===0?b=.5/t:y===i&&l===Math.PI&&(b=-.5/t);for(let R=0;R<=t;R++){let M=R/t;u.x=-e*Math.cos(n+M*s)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(n+M*s)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(M+b,1-v),f.push(c++)}h.push(f)}for(let y=0;y<i;y++)for(let f=0;f<t;f++){let v=h[y][f+1],b=h[y][f],R=h[y+1][f],M=h[y+1][f+1];(y!==0||a>0)&&p.push(v,b,M),(y!==i-1||l<Math.PI)&&p.push(b,R,M)}this.setIndex(p),this.setAttribute("position",new ve(g,3)),this.setAttribute("normal",new ve(_,3)),this.setAttribute("uv",new ve(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},no=class r extends Hi{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},nt=class r extends Ge{constructor(e=1,t=.4,i=12,n=48,s=2*Math.PI){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:n,arc:s},i=Math.floor(i),n=Math.floor(n);let a=[],o=[],l=[],c=[],h=new w,u=new w,d=new w;for(let p=0;p<=i;p++)for(let g=0;g<=n;g++){let _=g/n*s,m=p/i*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/n),c.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=n;g++){let _=(n+1)*p+g-1,m=(n+1)*(p-1)+g-1,y=(n+1)*(p-1)+g,f=(n+1)*p+g;a.push(_,m,f),a.push(m,y,f)}this.setIndex(a),this.setAttribute("position",new ve(o,3)),this.setAttribute("normal",new ve(l,3)),this.setAttribute("uv",new ve(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},ro=class r extends Ge{constructor(e=1,t=.4,i=64,n=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:n,p:s,q:a},i=Math.floor(i),n=Math.floor(n);let o=[],l=[],c=[],h=[],u=new w,d=new w,p=new w,g=new w,_=new w,m=new w,y=new w;for(let v=0;v<=i;++v){let b=v/i*s*Math.PI*2;f(b,s,a,e,p),f(b+.01,s,a,e,g),m.subVectors(g,p),y.addVectors(g,p),_.crossVectors(m,y),y.crossVectors(_,m),_.normalize(),y.normalize();for(let R=0;R<=n;++R){let M=R/n*Math.PI*2,A=-t*Math.cos(M),U=t*Math.sin(M);u.x=p.x+(A*y.x+U*_.x),u.y=p.y+(A*y.y+U*_.y),u.z=p.z+(A*y.z+U*_.z),l.push(u.x,u.y,u.z),d.subVectors(u,p).normalize(),c.push(d.x,d.y,d.z),h.push(v/i),h.push(R/n)}}for(let v=1;v<=i;v++)for(let b=1;b<=n;b++){let R=(n+1)*(v-1)+(b-1),M=(n+1)*v+(b-1),A=(n+1)*v+b,U=(n+1)*(v-1)+b;o.push(R,M,U),o.push(M,A,U)}function f(v,b,R,M,A){let U=Math.cos(v),P=Math.sin(v),B=R/b*v,G=Math.cos(B);A.x=M*(2+G)*.5*U,A.y=M*(2+G)*P*.5,A.z=M*Math.sin(B)*.5}this.setIndex(o),this.setAttribute("position",new ve(l,3)),this.setAttribute("normal",new ve(c,3)),this.setAttribute("uv",new ve(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},so=class r extends Ge{constructor(e=new ds(new w(-1,-1,0),new w(-1,1,0),new w(1,1,0)),t=64,i=1,n=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:n,closed:s};let a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new w,l=new w,c=new le,h=new w,u=[],d=[],p=[],g=[];function _(m){h=e.getPointAt(m/t,h);let y=a.normals[m],f=a.binormals[m];for(let v=0;v<=n;v++){let b=v/n*Math.PI*2,R=Math.sin(b),M=-Math.cos(b);l.x=M*y.x+R*f.x,l.y=M*y.y+R*f.y,l.z=M*y.z+R*f.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,u.push(o.x,o.y,o.z)}}(function(){for(let m=0;m<t;m++)_(m);_(s===!1?t:0),function(){for(let m=0;m<=t;m++)for(let y=0;y<=n;y++)c.x=m/t,c.y=y/n,p.push(c.x,c.y)}(),function(){for(let m=1;m<=t;m++)for(let y=1;y<=n;y++){let f=(n+1)*(m-1)+(y-1),v=(n+1)*m+(y-1),b=(n+1)*m+y,R=(n+1)*(m-1)+y;g.push(f,v,R),g.push(v,b,R)}}()})(),this.setIndex(g),this.setAttribute("position",new ve(u,3)),this.setAttribute("normal",new ve(d,3)),this.setAttribute("uv",new ve(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new ms[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},ao=class extends Ge{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,n=new w,s=new w;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let u=l[c],d=u.start;for(let p=d,g=d+u.count;p<g;p+=3)for(let _=0;_<3;_++){let m=o.getX(p+_),y=o.getX(p+(_+1)%3);n.fromBufferAttribute(a,m),s.fromBufferAttribute(a,y),yc(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,u=3*o+(c+1)%3;n.fromBufferAttribute(a,h),s.fromBufferAttribute(a,u),yc(n,s,i)===!0&&(t.push(n.x,n.y,n.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new ve(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function yc(r,e,t){let i=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,n=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(i)!==!0&&t.has(n)!==!0&&(t.add(i),t.add(n),!0)}var gm=Object.freeze({__proto__:null,BoxGeometry:at,CapsuleGeometry:Ot,CircleGeometry:wn,ConeGeometry:An,CylinderGeometry:pt,DodecahedronGeometry:Ya,EdgesGeometry:Za,ExtrudeGeometry:$a,IcosahedronGeometry:Qa,LatheGeometry:fs,OctahedronGeometry:eo,PlaneGeometry:rs,PolyhedronGeometry:Hi,RingGeometry:to,ShapeGeometry:io,SphereGeometry:it,TetrahedronGeometry:no,TorusGeometry:nt,TorusKnotGeometry:ro,TubeGeometry:so,WireframeGeometry:ao});var _s=class extends zi{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Ie(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};function Vr(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function zd(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}var Rn=class{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,n=t[i],s=t[i-1];t:{e:{let a;i:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<s)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=n,n=t[++i],e<n)break e}a=t.length;break i}if(e>=s)break t;{let o=t[1];e<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=s,s=t[--i-1],e>=s)break e}a=i,i=0}}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(n=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,n)}return this.interpolate_(i,s,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=e*n;for(let a=0;a!==n;++a)t[a]=i[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},oo=class extends Rn{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Tl,endingEnd:Tl}}intervalChanged_(e,t,i){let n=this.parameterPositions,s=e-2,a=e+1,o=n[s],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case wl:s=e,o=2*t-i;break;case Al:s=n.length-2,o=t+n[s]-n[s+1];break;default:s=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case wl:a=e,l=2*i-t;break;case Al:a=1,l=i+n[1]-n[0];break;default:a=e-1,l=t}let c=.5*(i-t),h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(i-t)/(n-t),_=g*g,m=_*g,y=-d*m+2*d*_-d*g,f=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,v=(-1-p)*m+(1.5+p)*_+.5*g,b=p*m-p*_;for(let R=0;R!==o;++R)s[R]=y*a[h+R]+f*a[c+R]+v*a[l+R]+b*a[u+R];return s}},lo=class extends Rn{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(n-t),u=1-h;for(let d=0;d!==o;++d)s[d]=a[c+d]*u+a[l+d]*h;return s}},co=class extends Rn{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}},Xt=class{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Vr(t,this.TimeBufferType),this.values=Vr(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Vr(e.times,Array),values:Vr(e.values,Array)};let n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new co(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new lo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new oo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case jr:t=this.InterpolantFactoryMethodDiscrete;break;case qr:t=this.InterpolantFactoryMethodLinear;break;case Gs:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0){if(e===this.DefaultInterpolation)throw new Error(i);this.setInterpolation(this.DefaultInterpolation)}return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return jr;case this.InterpolantFactoryMethodLinear:return qr;case this.InterpolantFactoryMethodSmooth:return Gs}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e}return this}trim(e,t){let i=this.times,n=i.length,s=0,a=n-1;for(;s!==n&&i[s]<e;)++s;for(;a!==-1&&i[a]>t;)--a;if(++a,s!==0||a!==n){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,n=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(n!==void 0&&zd(n))for(let o=0,l=n.length;o!==l;++o){let c=n[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===Gs,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o];if(c!==e[o+1]&&(o!==1||c!==e[0]))if(n)l=!0;else{let h=o*i,u=h-i,d=h+i;for(let p=0;p!==i;++p){let g=t[h+p];if(g!==t[u+p]||g!==t[d+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let h=o*i,u=a*i;for(let d=0;d!==i;++d)t[u+d]=t[h+d]}++a}}if(s>0){e[a]=e[s];for(let o=s*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=new this.constructor(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};Xt.prototype.TimeBufferType=Float32Array,Xt.prototype.ValueBufferType=Float32Array,Xt.prototype.DefaultInterpolation=qr;var Ii=class extends Xt{};Ii.prototype.ValueTypeName="bool",Ii.prototype.ValueBufferType=Array,Ii.prototype.DefaultInterpolation=jr,Ii.prototype.InterpolantFactoryMethodLinear=void 0,Ii.prototype.InterpolantFactoryMethodSmooth=void 0;var ho=class extends Xt{};ho.prototype.ValueTypeName="color";var uo=class extends Xt{};uo.prototype.ValueTypeName="number";var po=class extends Rn{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(n-t),c=e*o;for(let h=c+o;c!==h;c+=4)st.slerpFlat(s,0,a,c-o,a,c,l);return s}},Zn=class extends Xt{InterpolantFactoryMethodLinear(e){return new po(this.times,this.values,this.getValueSize(),e)}};Zn.prototype.ValueTypeName="quaternion",Zn.prototype.DefaultInterpolation=qr,Zn.prototype.InterpolantFactoryMethodSmooth=void 0;var Ui=class extends Xt{};Ui.prototype.ValueTypeName="string",Ui.prototype.ValueBufferType=Array,Ui.prototype.DefaultInterpolation=jr,Ui.prototype.InterpolantFactoryMethodLinear=void 0,Ui.prototype.InterpolantFactoryMethodSmooth=void 0;var mo=class extends Xt{};mo.prototype.ValueTypeName="vector";var fo=class{constructor(e,t,i){let n=this,s,a=!1,o=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(h){l++,a===!1&&n.onStart!==void 0&&n.onStart(h,o,l),a=!0},this.itemEnd=function(h){o++,n.onProgress!==void 0&&n.onProgress(h,o,l),o===l&&(a=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(h){n.onError!==void 0&&n.onError(h)},this.resolveURL=function(h){return s?s(h):h},this.setURLModifier=function(h){return s=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}},Hd=new fo,go=class{constructor(e){this.manager=e!==void 0?e:Hd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(n,s){i.load(e,n,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};go.DEFAULT_MATERIAL_NAME="__DEFAULT";var vs=class extends vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ie(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}},ys=class extends vs{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ie(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},ga=new we,xc=new w,Mc=new w,_o=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.map=null,this.mapPass=null,this.matrix=new we,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new En,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new Ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;xc.setFromMatrixPosition(e.matrixWorld),t.position.copy(xc),Mc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Mc),t.updateMatrixWorld(),ga.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ga),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ga)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),this.mapSize.x===512&&this.mapSize.y===512||(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var _m=new we,vm=new w,ym=new w;var vo=class extends _o{constructor(){super(new Tn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Cn=class extends vs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.shadow=new vo}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var xm=new we,Mm=new we,Sm=new we;var bm=new w,Em=new st,Tm=new w,wm=new w;var Am=new w,Rm=new st,Cm=new w,Lm=new w;var Eo="\\[\\]\\.:\\/",kd=new RegExp("["+Eo+"]","g"),_a="[^"+Eo+"]",Gd="[^"+Eo.replace("\\.","")+"]",Vd=new RegExp("^"+/((?:WC+[\/:])*)/.source.replace("WC",_a)+/(WCOD+)?/.source.replace("WCOD",Gd)+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_a)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_a)+"$"),Wd=["material","materials","bones","map"],ke=class r{constructor(e,t,i){this.path=t,this.parsedPath=i||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,i):new r(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(kd,"")}static parseTrackName(e){let t=Vd.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){let s=i.nodeName.substring(n+1);Wd.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,n=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(e[i]===void 0)return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[i]}if(c!==void 0){if(e[c]===void 0)return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[c]}}let a=e[n];if(a===void 0){let c=t.nodeName;return void console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",e)}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ke.Composite=class{constructor(r,e,t){let i=t||ke.parseTrackName(e);this._targetGroup=r,this._bindings=r.subscribe_(e,i)}getValue(r,e){this.bind();let t=this._targetGroup.nCachedObjects_,i=this._bindings[t];i!==void 0&&i.getValue(r,e)}setValue(r,e){let t=this._bindings;for(let i=this._targetGroup.nCachedObjects_,n=t.length;i!==n;++i)t[i].setValue(r,e)}bind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].bind()}unbind(){let r=this._bindings;for(let e=this._targetGroup.nCachedObjects_,t=r.length;e!==t;++e)r[e].unbind()}},ke.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ke.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ke.prototype.GetterByBindingType=[ke.prototype._getValue_direct,ke.prototype._getValue_array,ke.prototype._getValue_arrayElement,ke.prototype._getValue_toArray],ke.prototype.SetterByBindingTypeAndVersioning=[[ke.prototype._setValue_direct,ke.prototype._setValue_direct_setNeedsUpdate,ke.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ke.prototype._setValue_array,ke.prototype._setValue_array_setNeedsUpdate,ke.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ke.prototype._setValue_arrayElement,ke.prototype._setValue_arrayElement_setNeedsUpdate,ke.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ke.prototype._setValue_fromArray,ke.prototype._setValue_fromArray_setNeedsUpdate,ke.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Pm=new Float32Array(1);var Im=new le;var Um=new w,Dm=new w;var Nm=new w;var Om=new w,Fm=new we,Bm=new we;var zm=new w,Hm=new Ie,km=new Ie;var Gm=new w,Vm=new w,Wm=new w;var Xm=new w,jm=new Kn;var qm=new Dt;var Ym=new w;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:va}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=va);var In={name:"Boy (Student)",skin:"#eab193",skinShade:"#d89b7e",cheek:"#e9837f",hair:"#33251d",hairLock:"#47332a",hairHi:"#6a4c3b",hairStyle:"quiff",eyes:"#5c3c25",irisIn:"#82593a",gi:"#e3e8ef",giShade:"#cbd2dd",collar:"#1d1d22",belt:"#fdfdfb",proportions:{head:.235,hipHeight:.625,legs:1.2,headScale:.78}},jc={...In,name:"Coach Seif",skin:"#c98d66",skinShade:"#b27852",cheek:"#dc9c80",eyes:"#2e1c12",irisIn:"#4d311f",browTilt:.08,browThick:.0105,hair:"#17120f",hairLock:"#1f1813",hairHi:"#2d231c",hairFade:"#3a2d25",hairStyle:"crop",beard:"#3a2c23",beardDark:"#251b15",grin:!0,hogu:"#2452c4",headShape:[.9,1.07,.98],longJaw:!0,smileEyes:!0,eyeScale:.76,noseScale:1.6,belt:"#141417",beltGold:"#d9b44a",proportions:{head:.2,hipHeight:.625,legs:1.3,headScale:.93,neck:.035}},qc={...In,name:"Girl (Student)",skin:"#edb79f",hair:"#25262f",hairLock:"#30323e",hairHi:"#4a4e63",hairStyle:"longtail",eyes:"#4f321e",irisIn:"#755034",cheek:"#ea8590",lips:"#cf7480",girl:!0},Xd=[["Hips",null,0,.625,0],["Spine","Hips",0,.07,0],["Spine1","Spine",0,.15,0],["Neck","Spine1",0,.17,0],["Head","Neck",0,.055,0],["LeftArm","Spine1",.17,.125,0],["LeftForeArm","LeftArm",0,-.2,0],["LeftHand","LeftForeArm",0,-.165,0],["RightArm","Spine1",-.17,.125,0],["RightForeArm","RightArm",0,-.2,0],["RightHand","RightForeArm",0,-.165,0],["LeftUpLeg","Hips",.085,-.04,0],["LeftLeg","LeftUpLeg",0,-.28,0],["LeftFoot","LeftLeg",0,-.27,0],["LeftToeBase","LeftFoot",0,-.03,.105],["RightUpLeg","Hips",-.085,-.04,0],["RightLeg","RightUpLeg",0,-.28,0],["RightFoot","RightLeg",0,-.27,0],["RightToeBase","RightFoot",0,-.03,.105]];function Xc(r,e,t,i,n=[0,0,0],s=22,a=10){let o=new er(r.map(m=>new w(...m)),!1,"centripetal"),l=new w(...n),c=[],h=[],u=new w,d=new w,p=new w,g=new w;for(let m=0;m<=s;m++){let y=m/s;o.getPointAt(y,g),o.getTangentAt(y,u),d.copy(g).sub(l),d.addScaledVector(u,-d.dot(u)).normalize(),p.crossVectors(u,d).normalize();let f=e+(t-e)*Math.pow(y,1.3);y<.1&&(f*=.55+.45*y/.1),m===s&&(f=5e-4);let v=i*(f/e);for(let b=0;b<=a;b++){let R=b/a*Math.PI*2,M=Math.cos(R)*f,A=Math.sin(R)*v;c.push(g.x+p.x*M+d.x*A,g.y+p.y*M+d.y*A,g.z+p.z*M+d.z*A)}}for(let m=0;m<s;m++)for(let y=0;y<a;y++){let f=m*(a+1)+y,v=f+a+1;h.push(f,v,f+1,v,v+1,f+1)}let _=new Ge;return _.setAttribute("position",new ve(c,3)),_.setIndex(h),_.computeVertexNormals(),_}var be=(r,e,t)=>{let i=r*Math.PI/180,n=e*Math.PI/180;return[t*Math.cos(n)*Math.sin(i),t*Math.sin(n),t*Math.cos(n)*Math.cos(i)]},Mi=null;function jd(){if(Mi)return Mi;let r=[122,150,184,214,238,255],e=new Uint8Array(r.length*4);return r.forEach((t,i)=>e.set([t,t,t,255],i*4)),Mi=new ls(e,r.length,1,Pt),Mi.minFilter=Mi.magFilter=Et,Mi.generateMipmaps=!1,Mi.needsUpdate=!0,Mi}function qd(r){let e=new Set,t=r.userData.face;t&&[t.smile,t.open,t.ouch,...t.lashes].forEach(a=>a&&e.add(a)),r.userData.headband&&e.add(r.userData.headband);let i=[];r.traverse(a=>{a.isMesh||i.push(a)});let n=0,s=0;for(let a of i){let o=new Map;for(let l of a.children)!l.isMesh||e.has(l)||l.children.length||!l.visible||(n++,(o.get(l.material)||o.set(l.material,[]).get(l.material)).push(l));for(let[l,c]of o){if(c.length<2){s++;continue}let h=[],u=[],d=[],p=[],g=0;for(let y of c){y.updateMatrix();let f=y.geometry.clone();f.applyMatrix4(y.matrix);let v=f.attributes.position,b=f.attributes.normal,R=f.attributes.uv;for(let M=0;M<v.count;M++)h.push(v.getX(M),v.getY(M),v.getZ(M)),u.push(b?b.getX(M):0,b?b.getY(M):1,b?b.getZ(M):0),d.push(R?R.getX(M):0,R?R.getY(M):0);if(f.index)for(let M=0;M<f.index.count;M++)p.push(f.index.getX(M)+g);else for(let M=0;M<v.count;M++)p.push(M+g);g+=v.count,f.dispose(),a.remove(y)}let _=new Ge;_.setAttribute("position",new ve(h,3)),_.setAttribute("normal",new ve(u,3)),_.setAttribute("uv",new ve(d,2)),_.setIndex(g>65535?new Sn(p,1):new Mn(p,1)),_.computeBoundingSphere();let m=new Se(_,l);m.name="merged",a.add(m),s++}}r.userData.drawStats={before:n,after:s}}function To(r=In){let e=Jd(r);return qd(e.root),Zd(e.root),e}var Gi=null;function Yd(){return Gi||(Gi=new xn({color:"#3a3040",side:dt}),Gi.userData.shared=!0,Gi.onBeforeCompile=r=>{r.vertexShader=r.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
  transformed += normal * 0.008;`)},Gi)}function Zd(r){let e=/^(Left|Right)(UpLeg|Leg|Foot|ToeBase|Arm|ForeArm|Hand)$/,t=new Set([r.userData.mat?.patch,r.userData.mat?.red].filter(Boolean)),i=[];r.traverse(n=>{n.isMesh&&n.parent&&e.test(n.parent.name)&&!t.has(n.material)&&n.material!==Gi&&i.push(n)});for(let n of i){let s=new Se(n.geometry,Yd());s.name="ink",s.renderOrder=-1,n.add(s)}}function Jd(r=In){let e=new Ke;e.name="TaekwondoCharacter";let t={},i=r.proportions.legs||1,n=r.proportions.neck||0,s={Hips:.625+.55*(i-1),LeftLeg:-.28*i,RightLeg:-.28*i,LeftFoot:-.27*i,RightFoot:-.27*i,Head:.055+n};for(let[x,I,L,F,ie]of Xd){let k=s[x]??F,H=new Ke;H.name=x,H.position.set(L,k,ie),H.rotation.order=x==="Hips"?"YXZ":"XYZ",(I?t[I]:e).add(H),t[x]=H,H.userData.rest=H.position.clone()}let a=(x,I={})=>{let{roughness:L,metalness:F,...ie}=I;return new _s({color:x,gradientMap:jd(),...ie})},o={skin:a(r.skin,{roughness:.5}),gi:a(r.gi,{roughness:.85}),giShade:a(r.giShade,{roughness:.9}),collar:a(r.collar,{roughness:.7}),belt:a(r.belt,{roughness:.8}),hair:a(r.hair,{roughness:.55}),white:a("#ffffff",{roughness:.25}),iris:a(r.eyes,{roughness:.3}),pupil:a("#120a06",{roughness:.2}),brow:a(r.hair,{roughness:.7}),mouth:a(r.lips||"#b65f63",{roughness:.5}),cheek:a(r.cheek,{transparent:!0,opacity:.42,roughness:.6}),irisIn:a(r.irisIn||r.eyes,{roughness:.3}),hairLock:a(r.hairLock||r.hair,{roughness:.5}),hairHi:a(r.hairHi||r.hairLock||r.hair,{roughness:.4}),cuff:a(r.cuff||"#cdd4de",{roughness:.8}),ink:a("#2a2333",{roughness:.7}),shoe:a("#f4f4f2",{roughness:.45}),sole:a("#141416",{roughness:.6}),patch:a("#f2efe8",{roughness:.6}),red:a("#d22a2a",{roughness:.5}),blue:a("#1f4fb8",{roughness:.5})},l=(x,I,L,F=0,ie=0,k=0,H=0,X=0,z=0,q=null)=>{let oe=new Se(I,L);return oe.position.set(F,ie,k),oe.rotation.set(H,X,z),q&&oe.scale.set(...q),oe.castShadow=!0,oe.receiveShadow=!0,t[x].add(oe),oe},c=(x,I,L,F,ie,k=0,H=22)=>{let X=new pt(I,L,F,H,1);return l(x,X,ie,0,k-F/2,0)},h=(x,I=24,L=18)=>new it(x,I,L);for(let x of["Left","Right"]){let I=x==="Left"?1:-1;if(c(`${x}UpLeg`,.093,.085,.28*i,o.gi),l(`${x}UpLeg`,h(.093),o.gi),l(`${x}Leg`,h(.085),o.gi),c(`${x}Leg`,.085,.092,.27*i-.045,o.gi),l(`${x}Leg`,new pt(.094,.094,.024,26,1,!0),o.cuff,0,-(.27*i-.045)+.012,0).material.side=sr,c(`${x}Leg`,.037,.036,.06,o.skin,-(.27*i-.055)),r.shoes){l(`${x}Foot`,new Ot(.05,.13,8,16),o.shoe,0,-.01,.055,Math.PI/2,0,0,[1.08,1,.66]),l(`${x}Foot`,new at(.1,.016,.23),o.sole,0,-.046,.055),l(`${x}Foot`,new nt(.04,.007,6,20,Math.PI),o.sole,0,.02,.1,-Math.PI/2+.3,0,0);continue}l(`${x}Foot`,new Ot(.044,.075,8,16),o.skin,0,-.012,.032,Math.PI/2,0,0,[1.05,1,.62]),l(`${x}Foot`,h(.047),o.skin,0,-.004,-.005,0,0,0,[1,.9,1]),l(`${x}ToeBase`,h(.042,18,12),o.skin,I*.004,.016,.004,0,0,0,[1.06,.6,.62]);for(let L=0;L<5;L++){let F=L/4,ie=.018-F*.005;l(`${x}ToeBase`,h(ie,12,10),o.skin,I*(-.026+F*.05)*-1+0,.008,.03-F*.016)}}l("Hips",h(.152),o.gi,0,-.03,-.005,0,0,0,[1.12,.62,.82]),l("Spine",new pt(.157,.168,.2,28),o.gi,0,.07,0,0,0,0,[1,1,.78]),l("Spine1",new pt(.168,.155,.2,28),o.gi,0,.045,0,0,0,0,[1,1,.8]),l("Spine1",h(.171),o.gi,0,.12,0,0,0,0,[1.02,.45,.8]),l("Hips",new pt(.17,.192,.15,28,1,!0),o.gi,0,.005,0,0,0,0,[1,1,.82]).material.side=sr,l("Spine",new pt(.17,.172,.05,30,1,!0),o.belt,0,-.005,0,0,0,0,[1.01,1,.8]).material.side=sr,l("Spine",new it(.04,16,12),o.belt,0,-.005,.143,0,0,0,[1.3,.85,.7]);let u=new Ke;u.name="BeltTail",u.position.set(0,-.012,.146),u.rotation.order="XYZ",t.Spine.add(u),t.BeltTail=u,u.userData.rest=u.position.clone();let d=(x,I,L)=>{let F=new Se(new at(.04,I,.012),o.belt);F.geometry.translate(0,-I/2,0),F.position.set(x,0,0),F.rotation.z=L,u.add(F)};if(d(-.018,.25,-.12),d(.02,.23,.16),r.beltGold){let x=new Se(new at(.012,.1,.014),a(r.beltGold,{roughness:.35}));x.geometry.translate(0,-.12,0),x.position.set(-.018,0,.002),x.rotation.z=-.12,u.add(x)}for(let x of[-.03,.02])l("Spine",new nt(.173,.003,6,44),o.cuff,0,x,0,Math.PI/2,0,0,[1.01,.8,1]);if(r.shoes?(l("Spine1",new at(.045,.3,.016),o.collar,-.02,.06,.14,-.15,0,.55),l("Spine1",new at(.04,.14,.014),o.collar,.06,.12,.128,-.2,0,-.5),l("Spine1",new nt(.07,.016,8,24,Math.PI),o.collar,0,.17,-.01,Math.PI/2+.25,0,Math.PI)):(l("Spine1",new at(.05,.21,.014),o.collar,.044,.1,.126,-.18,0,-.43),l("Spine1",new at(.05,.21,.014),o.collar,-.044,.1,.126,-.18,0,.43),l("Spine1",new at(.05,.04,.016),o.collar,0,.01,.136,-.12,0,0),l("Spine",new at(.045,.16,.014),o.collar,-.032,.085,.127,-.05,-.22,-.4),l("Spine1",new nt(.07,.014,8,24,Math.PI),o.collar,0,.17,-.01,Math.PI/2+.25,0,Math.PI)),r.hogu){let x=a(r.hogu,{roughness:.45}),I=a("#2f60d8",{roughness:.45}),L=a("#16161a",{roughness:.6}),F=a("#e9edf2",{roughness:.6});l("Spine",new pt(.184,.18,.14,32),x,0,.1,0,0,0,0,[.99,1,.86]),l("Spine1",new pt(.176,.186,.14,32),x,0,.02,0,0,0,0,[.99,1,.86]),l("Spine",new nt(.182,.007,6,40),L,0,.032,0,Math.PI/2,0,0,[.99,.86,1]),l("Spine1",new nt(.176,.007,6,40),L,0,.09,0,Math.PI/2,0,0,[.99,.86,1]);for(let[ie,k,H]of[["Spine1",.035,.05],["Spine",.125,.046],["Spine",.065,.042]])for(let X of[1,-1])l(ie,h(H,16,12),I,X*.052,k,.147,0,0,0,[1.05,.78,.32]);for(let ie of[1,-1])l("Spine1",new nt(.085,.013,6,20,Math.PI),F,ie*.1,.1,0,0,Math.PI/2,0,[1,1,.9])}for(let x of["Left","Right"]){l(`${x}Arm`,h(.067),o.gi),c(`${x}Arm`,.063,.058,.2,o.gi),l(`${x}ForeArm`,h(.058),o.gi),c(`${x}ForeArm`,.058,.063,.14,o.gi),l(`${x}ForeArm`,new pt(.065,.065,.022,24,1,!0),o.cuff,0,-.129,0).material.side=sr,c(`${x}ForeArm`,.036,.038,.05,o.skin,-.12),l(`${x}Hand`,new it(.046,20,16),o.skin,0,-.035,.005,0,0,0,[.92,1,1.12]),l(`${x}Hand`,new Ot(.016,.03,6,10),o.skin,(x==="Left"?-1:1)*.03,-.03,.04,0,0,.9);for(let I=0;I<4;I++)l(`${x}Hand`,h(.0145,10,8),o.skin,-.027+I*.018,-.066,.03)}if(r.shoes||l("LeftArm",new at(.012,.045,.04),o.collar,.064,-.06,0,0,0,0),r.shoes){let x=l("LeftArm",new pt(.04,.04,.008,24),o.patch,.068,-.07,0,0,0,Math.PI/2);l("LeftArm",new pt(.018,.018,.01,20),o.red,.072,-.07,0,0,0,Math.PI/2);for(let I=0;I<8;I++){let L=I/8*Math.PI*2;l("LeftArm",h(.004,6,4),o.sole,.073,-.07+Math.sin(L)*.029,Math.cos(L)*.029)}}c("Neck",.046,.05,.08+n,o.skin,.07+n);let p=new Ke;p.name="HeadContent",p.scale.setScalar(r.proportions.headScale||1),t.Head.add(p),r.headShape&&p.scale.multiply(new w(...r.headShape));let g=(x,I,L=0,F=0,ie=0,k=0,H=0,X=0,z=null)=>{let q=new Se(x,I);return q.position.set(L,F,ie),q.rotation.set(k,H,X),z&&q.scale.set(...z),q.castShadow=!0,q.receiveShadow=!0,p.add(q),q},_=r.proportions.head;g(h(_,40,32),o.skin,0,_*.92,.01,0,0,0,[.98,1.05,.98]);let m=r.longJaw?{y:_*.5,s:[.82,1,.92]}:{y:_*.58,s:[.86,.84,.93]};g(h(_*.93,32,24),o.skin,0,m.y,.05,0,0,0,m.s);let y={eyes:[],brows:[],lashes:[]},f=(x,I,L,F=0,ie=0,k=0,H=0,X=0,z=0,q=null)=>{let oe=new Se(I,L);return oe.position.set(F,ie,k),oe.rotation.set(H,X,z),q&&oe.scale.set(...q),x.add(oe),oe};for(let x of[1,-1]){let I=_*.9;g(h(.05,16,12),o.skin,x*_*.97,I-.02,-.01,0,0,0,[.5,1,.8]),g(h(.03,12,10),o.cheek,x*(_*.97+.012),I-.02,-.005,0,0,0,[.45,.9,.7]);let L=new Ke;L.position.set(x*.089,I-.004,_*.855),p.add(L),y.eyes.push(L),r.eyeScale&&L.scale.setScalar(r.eyeScale),f(L,h(.062,26,20),o.white,0,0,0,0,0,0,[1.02,1.08,.55]),f(L,h(.045,22,18),o.iris,0,-.008,.022,0,0,0,[1,1.1,.5]),f(L,h(.034,20,16),o.irisIn,0,-.009,.029,0,0,0,[1,1.08,.5]),f(L,h(.019,16,12),o.pupil,0,-.009,.038,0,0,0,[1,1,.45]),f(L,h(.0115,10,8),o.white,x*-.014+.002,.016,.046),f(L,h(.006,8,6),o.white,x*.012,-.024,.044),r.smileEyes&&f(L,new it(.0665,26,12,0,Math.PI*2,Math.PI*.66,Math.PI*.34),o.skin,0,0,.002,0,0,x*-.14,[1.06,1.1,.9]);let F=new Ke;F.rotation.z=x*.1,L.add(F),f(F,new it(.0655,26,12,0,Math.PI*2,0,Math.PI*.25),o.skin,0,0,0,0,0,0,[1.04,1.08,.86]);let ie=.0655*Math.cos(Math.PI*.25)*1.08;if(f(F,new nt(.0655*Math.sin(Math.PI*.25)*1.04,r.girl?.0095:.0072,6,28),o.brow,0,ie,0,Math.PI/2,0,0,[1,.86,1]),r.girl)for(let z=0;z<3;z++)f(F,new An(.0065,.026,6),o.brow,x*(.05+z*.006),ie+.004+z*.006,.022-z*.01,0,0,x*-(1+z*.25));let k=I+(r.girl?.1:.093),H=.01+Math.sqrt(Math.max(0,_*_-((k-_*.92)/1.04)**2))*.97,X=new Ke;X.position.set(x*.09,k,H),p.add(X),X.userData.sx=x,y.brows.push(X),f(X,new Ot(r.browThick||(r.girl?.0095:.0125),.062,6,10),o.brow,0,0,0,0,0,Math.PI/2+x*(r.browTilt??(r.girl?.14:.2))),r.beard||g(h(.036,14,10),o.cheek,x*.14,I-.078,_*.73,0,0,0,[1,.66,.4])}let v=r.noseScale||1;if(g(new Ot(.016*v,.034*v,6,12),o.skin,0,_*.81-(v-1)*.01,_*.955,.42,0,0,[1,1,.85]),g(h(.024*v,14,12),o.skin,0,_*.765-(v-1)*.018,_*.985+(v-1)*.01,0,0,0,[1.05,.85,.9]),r.beard||g(h(.014,10,8),o.cheek,0,_*.775,_*1.06,0,0,0,[1,.8,.6]),r.grin){let x=new Ke;x.position.set(0,_*.575,.05+_*.9),x.rotation.x=-.32,x.scale.set(1.42,1.3,1),p.add(x);let I=new Se(new wn(.05,28,Math.PI,Math.PI),a("#5a1f22"));I.scale.set(1,.62,1),x.add(I);let L=new Se(new wn(.046,28,Math.PI,Math.PI),o.white);L.scale.set(1,.36,1),L.position.set(0,-.002,.002),x.add(L);let F=new Se(new nt(.05,.006,6,28,Math.PI),o.mouth);F.rotation.z=Math.PI,F.scale.set(1,.62,1),F.position.z=.001,x.add(F),y.smile=x}else y.smile=g(new nt(.03,.0075,8,22,Math.PI*.7),o.mouth,.01,_*.63,.05+_*.872,0,0,Math.PI*1.15);let b=a("#5a1f22");if(y.open=g(h(.03,16,12),b,.004,_*.58,.05+_*.862,0,0,0,[1,1.15,.4]),y.open.visible=!1,y.ouch=g(h(.03,16,12),b,.004,_*.6,.05+_*.866,0,0,0,[1.35,.45,.4]),y.ouch.visible=!1,r.grin)for(let x of[y.open,y.ouch])x.scale.x*=1.3,x.scale.y*=1.25,x.position.x=0;e.userData.face=y;let R=new Se(new nt(_*1,.018,10,40),a("#d63a3a",{roughness:.7}));R.position.set(0,_*1.08,-.005),R.rotation.x=Math.PI/2-.32,R.scale.set(1.02,1.08,1),R.visible=!1,p.add(R),e.userData.mat=o,e.userData.headband=R;let M=new Ke;if(M.position.set(0,_*.92,.01),p.add(M),r.beard){let x=a(typeof r.beard=="string"?r.beard:r.hair,{roughness:.8}),I=r.beardDark?a(r.beardDark,{roughness:.8}):x,L={c:[0,m.y,.05],r:[_*.93*m.s[0],_*.93*m.s[1],_*.93*m.s[2]]},F=(X,z,q=1.02)=>{let oe=X*Math.PI/180,E=z*Math.PI/180;return[L.c[0]+L.r[0]*q*Math.cos(E)*Math.sin(oe),L.c[1]+L.r[1]*q*Math.sin(E),L.c[2]+L.r[2]*q*Math.cos(E)*Math.cos(oe)]},ie=(X,z,q)=>{let oe=N=>{N=Math.abs(N);for(let W=1;W<X.length;W++)if(N<=X[W][0]){let[ee,$]=X[W-1],[S,re]=X[W];return $+(re-$)*(N-ee)/(S-ee)}return-86},E=X[X.length-1][0],T=64,V=18,Q=[],D=[];for(let N=0;N<=T;N++){let W=-E+2*E*N/T,ee=oe(W),$=W*Math.PI/180;for(let S=0;S<=V;S++){let re=(-86+(ee+86)*S/V)*Math.PI/180;Q.push(Math.cos(re)*Math.sin($),Math.sin(re),Math.cos(re)*Math.cos($))}}for(let N=0;N<T;N++)for(let W=0;W<V;W++){let ee=N*(V+1)+W,$=ee+V+1;D.push(ee,$,ee+1,ee+1,$,$+1)}let J=new Ge;J.setAttribute("position",new ve(Q,3)),J.setIndex(D),J.computeVertexNormals();let O=new Se(J,q);return O.position.set(...L.c),O.scale.set(L.r[0]*z,L.r[1]*z,L.r[2]*z),O.castShadow=!0,p.add(O),O};ie([[0,-17],[22,-13],[40,-5],[60,5],[78,17],[92,30],[100,30]],1.018,x),r.beardDark&&ie([[0,-16],[16,-14],[28,-26],[40,-56],[46,-86]],1.03,I);let k=new Se(h(.034,16,12),I);k.position.set(...F(0,-62,.99)),k.scale.set(1.3,.9,.8),p.add(k);let H=new Se(new nt(.066,.012,8,26,Math.PI),I);H.position.set(0,_*.585,.05+_*.89),H.rotation.x=-.32,H.scale.set(1.12,.5,.7),p.add(H);for(let X of[1,-1]){let z=new Se(Xc([F(X*31,-2,1.03),F(X*29,-10,1.03),F(X*25,-18,1.025)],.018,.028,.012,L.c),x);p.add(z)}}if(r.hairStyle==="bun"){let x=new Se(new it(_*1.04,36,24,0,Math.PI*2,0,Math.PI*.55),o.hair);x.rotation.x=-.5,x.position.set(0,.01,-.03),M.add(x);let I=new Se(new it(.055,18,14),o.hair);I.position.set(0,_*1.08,-_*.3),M.add(I);let L=new Se(new nt(.035,.01,6,16),a("#1b1b1b"));L.position.set(0,_*1,-_*.28),L.rotation.x=Math.PI/2-.5,M.add(L);for(let F of[1,-1]){let ie=new Se(new Ot(.014,.05,6,10),o.hair);ie.position.set(F*.075,_*.1,_*.86),ie.rotation.z=Math.PI/2+F*.15,M.add(ie)}return e.userData.bones=t,{root:e,bones:t}}let A=(x,I,L,F,ie,k,H,X=0,z=0,q=0,oe=o.hair)=>{let E=new Se(new it(1,28,20),oe);return E.position.set(I,L,F),E.scale.set(ie,k,H),E.rotation.set(X,z,q),E.castShadow=!0,x.add(E),E},U=(x,I,L,F,ie,k,H=o.hairLock)=>{let X=new Se(Xc(I,L,F,ie,k),H);return X.castShadow=!0,x.add(X),X},P=_*1;if(r.hairStyle==="longtail"){let x=new Se(new it(_*1.04,40,28,0,Math.PI*2,0,Math.PI*.62),o.hair);x.rotation.x=-.45,x.position.set(0,.012,-.03),x.castShadow=!0,M.add(x),A(M,0,-.05,-.07,_*.98,_*.88,_*.86);let I=be(0,196,P*1.02);for(let k of[-62,-40,-18,4,30,54]){let H=k+6;U(M,[be(H,36+Math.abs(k)*.1,P*1),be(k*.95,70,P*1.09),be(k*.8,110,P*1.09),be(k*.5,160,P*1.07),[I[0]+k*6e-4,I[1]+.01,I[2]]],.055,.03,.022,[0,-.02,0],k===4||k===-18?o.hairHi:o.hairLock)}for(let[k,H]of[[0,0],[-6,.012],[-12,.02]])U(M,[be(28,82+k,P*1.07),be(5,62+k,P*1.09),be(-30,46+k,P*1.07),be(-62,30+k,P*1.03),be(-80,12+k,P*1)],.055-H,.025,.02,[0,-.02,0]);for(let k of[1,-1])U(M,[be(k*72,22,P*1),be(k*100,22,P*1.05),be(k*140,10,P*1.03),be(k*170,0,P*1.01)],.06,.03,.025,[0,-.02,0]),U(M,[be(k*80,-8,P*.99),be(k*108,-12,P*1.03),be(k*150,-14,P*1)],.045,.02,.02,[0,-.02,0]);U(M,[be(-74,18,P*1),be(-84,-10,P*1.03),be(-82,-40,P*1.03),be(-78,-62,P*1)],.02,.008,.012,[0,0,-.1]);let L=new Ke;L.name="Ponytail",L.position.set(...I),L.rotation.order="XYZ",M.add(L),t.Ponytail=L,L.userData.rest=L.position.clone();let F=new Se(new nt(.03,.013,8,20),a("#3a2f45",{roughness:.6}));F.rotation.x=Math.PI/2-.3,F.position.set(0,0,-.02),L.add(F),A(L,0,-.01,-.035,.05,.055,.045);let ie=[0,-.15,.35];return U(L,[[0,0,-.04],[0,-.09,-.11],[.012,-.24,-.13],[-.012,-.4,-.11],[0,-.56,-.08]],.064,.014,.036,ie,o.hairHi),U(L,[[.022,0,-.03],[.038,-.1,-.09],[.044,-.26,-.1],[.028,-.42,-.07],[.036,-.52,-.05]],.05,.012,.03,ie),U(L,[[-.022,0,-.03],[-.036,-.1,-.095],[-.04,-.25,-.11],[-.042,-.41,-.09],[-.026,-.5,-.08]],.05,.012,.03,ie),U(L,[[0,-.01,-.02],[.004,-.12,-.07],[-.01,-.28,-.075],[.01,-.44,-.05],[-.004,-.54,-.03]],.046,.01,.028,ie),e.userData.bones=t,{root:e,bones:t}}if(r.hairStyle==="crop"){let x=new Se(new it(_*1.025,40,24,0,Math.PI*2,0,Math.PI*.47),o.hair);x.rotation.x=-.46,x.position.set(0,.015,-.012),x.castShadow=!0,M.add(x);for(let F of[1,-1])U(M,[be(F*62,34,P*1),be(F*70,24,P*1.015),be(F*78,12,P*1.015),be(F*84,0,P*1)],.05,.026,.014,[0,0,0]),U(M,[be(F*80,40,P*1),be(F*92,28,P*1.015),be(F*104,16,P*1.015),be(F*112,4,P*1)],.06,.04,.014,[0,0,0]);let I=new Se(new it(_*1.012,40,8,Math.PI/2+.95,Math.PI*2-1.9,Math.PI*.4,Math.PI*.095),a(r.hairFade||r.hair,{roughness:.8}));I.rotation.x=-.6,I.position.set(0,.006,-.01),M.add(I);let L=new Se(new it(_*1.008,32,12,Math.PI*1.5-1.2,2.4,Math.PI*.5,Math.PI*.36),I.material);L.scale.set(.98,1.05,.98),M.add(L);for(let[F,ie]of[[-36,64],[-12,68],[12,68],[36,64],[-24,86],[0,90],[24,86]])A(M,...be(F,ie,P*1.03),.05,.02,.042,-.5,F*Math.PI/180,0,o.hairLock);return e.userData.bones=t,{root:e,bones:t}}if(r.hairStyle==="quiff"){let x=new Se(new it(_*1.03,36,24,0,Math.PI*2,0,Math.PI*.6),o.hair);x.rotation.x=-.4,x.position.set(0,.012,-.02),x.castShadow=!0,M.add(x);let I=r.hairLift??1;for(let[L,F,ie]of[[-50,1.12,1],[-32,1.2,1],[-14,1.26,1],[4,1.3,1],[22,1.26,1],[40,1.18,1],[56,1.1,.9]]){let k=1+(F-1)*I,H=14;U(M,[be(L,38+Math.abs(L)*.12,P*1),be(L+H*.3,56,P*k),be(L*.9+H*.6,82,P*(k-.06)),be(L*.8+H,118,P*1.1),be(L*.7+H,150*ie,P*1.04)],.07,.035,.04,[0,-.04,-.02],Math.abs(L+5)<12||L===22?o.hairHi:o.hairLock)}for(let L of[-20,10,38])U(M,[be(L,100,P*1.06),be(L+6,135,P*1.07),be(L+8,165,P*1.03),be(L+6,190,P*.98)],.07,.03,.03,[0,0,0]);for(let L of[1,-1]){U(M,[be(L*70,30,P*1),be(L*95,28,P*1.05),be(L*130,22,P*1.04),be(L*160,12,P*1)],.06,.03,.025,[0,-.02,0]);let F=new Se(new Ot(.018,.045,6,10),o.hair);F.position.set(L*_*.93,-.03,.04),F.castShadow=!0,M.add(F)}return e.userData.bones=t,{root:e,bones:t}}let B=new Se(new it(_*1.04,36,24,0,Math.PI*2,0,Math.PI*.58),o.hair);B.rotation.x=-.38,B.position.set(0,.012,-.02),B.castShadow=!0,M.add(B);let G=(x,I,L,F)=>{let ie=new An(F,L,10);ie.translate(0,L/2,0);let k=new Se(ie,o.hair);k.castShadow=!0;let H=new w(Math.sin(I)*Math.sin(x),Math.cos(I),Math.sin(I)*Math.cos(x));k.position.copy(H.clone().multiplyScalar(_*.9)),k.quaternion.setFromUnitVectors(new w(0,1,0),H.add(new w(0,.55,-.25)).normalize()),M.add(k)};for(let x=0;x<7;x++)G(-.9+x*.3,.38,.17-Math.abs(x-3)*.012,.055);for(let x=0;x<9;x++)G(x*(Math.PI*2/9)+.2,.75,.13,.05);for(let x=0;x<7;x++)G(Math.PI*.55+x*.3,1.15,.1,.048);G(0,.1,.19,.06),G(.6,.18,.16,.055),G(-.6,.18,.16,.055);for(let x of[1,-1]){let I=new Se(new Ot(.022,.06,6,10),o.hair);I.position.set(x*_*.93,-.02,.03),I.castShadow=!0,M.add(I)}return e.userData.bones=t,{root:e,bones:t}}var Io={Hips:[0,-40,0],Spine:[3,8,0],Spine1:[2,10,0],Neck:[0,10,0],Head:[-2,12,0],LeftArm:[-42,0,22],LeftForeArm:[-112,0,0],LeftHand:[10,0,0],RightArm:[-28,0,-20],RightForeArm:[-122,0,0],RightHand:[10,0,0],LeftUpLeg:[-26,0,6],LeftLeg:[26,0,0],LeftFoot:[0,0,0],RightUpLeg:[10,0,-6],RightLeg:[21.5,0,0],RightFoot:[-24,0,0],Ponytail:[14,0,0]},he=(r={})=>({...Io,...r}),wt={LeftArm:[-38,0,18],LeftForeArm:[-126,0,0],RightArm:[-20,0,-14],RightForeArm:[-132,0,0]},ar={LeftUpLeg:[-22,0,6],LeftLeg:[35,0,0],LeftFoot:[-13,0,0],RightUpLeg:[10,0,-6],RightLeg:[25.5,0,0],RightFoot:[-18.5,0,0],Spine:[6,8,0]},Un=(...r)=>r.map((e,t)=>({time:e,name:"phase",int:t})),Yc={...wt,Hips:[0,9,0],Spine:[-4,-4,0],Spine1:[2,-4,0],Neck:[0,-4,0],Head:[-2,-4,0],LeftUpLeg:[-4,38,-1],LeftLeg:[14,0,0],LeftFoot:[-7,0,0],RightUpLeg:[-112,0,6],RightLeg:[110,0,0],RightFoot:[40,0,0],RightToeBase:[-15,0,0]},je={...wt,Hips:[0,16,0],Spine:[-4,-6,0],Spine1:[-2,-4,0],Neck:[0,-4,0],Head:[8,-4,0],LeftUpLeg:[-3,30,1],LeftLeg:[8,0,0],LeftFoot:[-1,0,0],RightUpLeg:[-116,0,10],RightLeg:[4,0,0],RightFoot:[55,0,0],RightToeBase:[-60,0,0],Ponytail:[34,0,0]},Kd={...wt,Hips:[0,-10,0],Spine:[-10,0,0],Spine1:[2,2,0],Neck:[0,10,0],Head:[8,6,0],LeftUpLeg:[-7,36,-2],LeftLeg:[2,0,0],LeftFoot:[11,0,0],RightUpLeg:[-116,0,12],RightLeg:[2,0,0],RightFoot:[-20,0,0],RightToeBase:[-15,0,0],Ponytail:[28,0,0]},Vi={Hips:[0,-8,0],Spine:[-15,11,0],Spine1:[5,-6,0],Neck:[0,8,-2],Head:[16,4,0],LeftArm:[-20,0,24],LeftForeArm:[-130,0,0],RightArm:[-8,0,-20],RightForeArm:[-144,0,0],LeftUpLeg:[-2,35,-6],LeftLeg:[0,0,0],LeftFoot:[3,0,0],RightUpLeg:[-156,25,-1],RightLeg:[2,0,0],RightFoot:[-6,0,0],RightToeBase:[-20,0,0],Ponytail:[38,0,0]},Co={...wt,Hips:[-6,-10,0],Spine:[2,0,0],Spine1:[2,4,0],Neck:[0,8,0],Head:[4,6,0],LeftUpLeg:[-8,34,-5],LeftLeg:[16,0,0],LeftFoot:[2,0,0],RightUpLeg:[-128,-5,9],RightLeg:[6,0,0],RightFoot:[-20,0,0],RightToeBase:[-25,0,0],Ponytail:[12,0,0]},$d={...wt,Hips:[-4,-12,0],Spine:[2,-2,0],Spine1:[2,6,0],Neck:[0,9,0],Head:[0,9,0],LeftUpLeg:[-9,40,-4],LeftLeg:[12,0,0],LeftFoot:[2,0,0],RightUpLeg:[-70,-3,8],RightLeg:[3,0,0],RightFoot:[-10,0,0]},Zc={...wt,Hips:[0,-16,0],Spine:[2,0,0],Spine1:[2,8,0],Neck:[0,10,0],Head:[-2,10,0],LeftUpLeg:[6,42,2],LeftLeg:[6,0,0],LeftFoot:[-14,0,0],RightUpLeg:[-14,0,4],RightLeg:[2,0,0],RightFoot:[12,0,0]},Jc={Hips:[10,10,-2],Spine:[-4,-2,0],Spine1:[2,-2,0],Neck:[0,-2,0],Head:[-2,-4,0],LeftUpLeg:[-20,28,6],LeftLeg:[21,0,0],LeftFoot:[-6,0,0],RightUpLeg:[-4,0,-6],RightLeg:[10,0,0],RightFoot:[-5,0,0]},nh={...wt,Hips:[-18,56,-8],Spine:[-10,3,-3],Spine1:[-4,8,1],Neck:[13,-29,4],Head:[14,-36,6],LeftUpLeg:[18,10,-6],LeftLeg:[3,0,0],LeftFoot:[-9,-16,13],RightUpLeg:[-107,0,-68],RightLeg:[115,0,0],RightFoot:[19,0,0],RightToeBase:[-30,0,0]},Uo={...nh,Hips:[-3,81,-20],Spine:[-8,-17,-26],Spine1:[16,0,10],Neck:[21,-12,12],Head:[6,-36,6],LeftUpLeg:[12,13,11],LeftLeg:[3,0,0],LeftFoot:[-25,0,33],RightUpLeg:[-12,16,-82],RightLeg:[115,0,0],RightFoot:[19,0,0]},Qd={...Uo,Hips:[-21,85,-20],Spine:[-10,-18,-13],Spine1:[5,-1,-1],Neck:[25,-21,16],Head:[6,-35,6],LeftUpLeg:[22,12,4],LeftLeg:[4,0,0],LeftFoot:[-25,0,33],RightUpLeg:[-1,1,-80],RightLeg:[62,0,0],RightFoot:[22,0,0]},li={...wt,Hips:[-8,81,-21],Spine:[-7,0,-30],Spine1:[-9,-12,23],Neck:[15,-34,9],Head:[19,-40,12],LeftUpLeg:[-2,11,14],LeftLeg:[3,0,0],LeftFoot:[-21,0,25],RightUpLeg:[-14,17,-77],RightLeg:[2,0,0],RightFoot:[22,0,0],RightToeBase:[10,0,0],Ponytail:[30,0,-25]},ep={...Uo,Hips:[-14,73,-19],Spine:[-8,0,-2],Spine1:[-7,-11,7],Neck:[13,-28,8],Head:[6,-36,2],LeftUpLeg:[12,12,4],LeftLeg:[4,0,0],LeftFoot:[-25,0,33],RightUpLeg:[-11,28,-76],RightLeg:[115,0,0],RightFoot:[19,0,0]},Kc={Hips:[0,-14,0],Spine:[-10,4,0],LeftUpLeg:[-4,0,4],LeftLeg:[4,0,0],LeftFoot:[14,0,0],RightUpLeg:[-92,0,-4],RightLeg:[4,0,0],RightFoot:[20,0,0]},tp={...wt,Hips:[0,-12,0],Spine:[-16,4,0],Head:[12,6,0],LeftUpLeg:[-2,0,4],LeftLeg:[2,0,0],LeftFoot:[18,0,0],RightUpLeg:[-138,0,-4],RightLeg:[2,0,0],RightFoot:[10,0,0]},$c={Hips:[0,-12,0],Spine:[-6,4,0],LeftUpLeg:[-8,0,4],LeftLeg:[12,0,0],RightUpLeg:[-104,0,-4],RightLeg:[116,0,0],RightFoot:[-40,0,0]},Qc={...wt,Hips:[0,-8,0],Spine:[-20,4,0],Spine1:[-4,4,0],Head:[14,6,0],LeftUpLeg:[-4,0,4],LeftLeg:[8,0,0],LeftFoot:[10,0,0],RightUpLeg:[-82,0,-2],RightLeg:[6,0,0],RightFoot:[-62,0,0]},Wi={Hips:[0,0,0],Spine:[0,0,0],Spine1:[0,0,0],Neck:[0,0,0],Head:[0,0,0],LeftArm:[0,0,6],LeftForeArm:[-4,0,0],LeftHand:[0,0,0],RightArm:[0,0,-6],RightForeArm:[-4,0,0],RightHand:[0,0,0],LeftUpLeg:[0,0,1],LeftLeg:[0,0,0],LeftFoot:[0,0,0],RightUpLeg:[0,0,-1],RightLeg:[0,0,0],RightFoot:[0,0,0],Ponytail:[12,0,0]},wo={...Wi,Hips:[0,-20,0],Spine:[-3,0,0],Head:[-2,10,0],LeftUpLeg:[-4,0,6],RightUpLeg:[4,0,-6],LeftArm:[-30,-80,12],LeftForeArm:[-104,0,0],RightArm:[-34,80,-12],RightForeArm:[-100,0,0]},Ao={Hips:[0,-10,0],Spine:[-6,0,0],Spine1:[-4,0,0],Neck:[0,0,0],Head:[-10,0,0],RightArm:[-158,0,-34],RightForeArm:[-28,0,0],LeftArm:[8,0,26],LeftForeArm:[-92,0,0],LeftUpLeg:[-8,0,8],LeftLeg:[6,0,0],LeftFoot:[4,0,0],RightUpLeg:[12,0,-8],RightLeg:[10.5,0,0],RightFoot:[-6,0,0],Ponytail:[18,0,0]},eh={Hips:[-8,-30,0],Spine:[24,4,0],Spine1:[16,6,0],Neck:[10,0,0],Head:[14,4,0],LeftArm:[-30,0,10],LeftForeArm:[-135,0,0],RightArm:[-24,0,-8],RightForeArm:[-140,0,0],LeftUpLeg:[-30,0,6],LeftLeg:[30,0,0],LeftFoot:[8,0,0],RightUpLeg:[28,0,-6],RightLeg:[26,0,0],Ponytail:[-12,0,0]},th={Hips:[4,-34,0],Spine:[-18,4,-4],Spine1:[-8,6,0],Neck:[-18,-6,0],Head:[-26,14,6],LeftArm:[-64,0,34],LeftForeArm:[-74,0,0],RightArm:[-52,0,-30],RightForeArm:[-86,0,0],LeftUpLeg:[-26,0,6],LeftLeg:[26,0,0],RightUpLeg:[30,0,-6],RightLeg:[22,0,0],Ponytail:[44,0,8]},Es={Hips:[0,0,0],Spine:[4,-4,0],Spine1:[0,-4,0],Head:[0,8,0],Neck:[0,0,0],LeftUpLeg:[-26,0,2],LeftLeg:[8,0,0],LeftFoot:[-10,0,0],RightUpLeg:[20,0,-2],RightLeg:[22,0,0],RightFoot:[10,0,0],LeftArm:[20,0,10],LeftForeArm:[-30,0,0],RightArm:[-24,0,-10],RightForeArm:[-36,0,0],LeftHand:[0,0,0],RightHand:[0,0,0]},ip={...Es,Spine:[4,4,0],Spine1:[0,4,0],Head:[0,-8,0],LeftUpLeg:[20,0,2],LeftLeg:[22,0,0],LeftFoot:[10,0,0],RightUpLeg:[-26,0,-2],RightLeg:[8,0,0],RightFoot:[-10,0,0],LeftArm:[-24,0,10],LeftForeArm:[-36,0,0],RightArm:[20,0,-10],RightForeArm:[-30,0,0]},ih=r=>({...Es,Spine:[4,0,0],Spine1:[0,0,0],Head:[0,0,0],LeftUpLeg:r?[-4,0,2]:[-30,0,2],LeftLeg:r?[4,0,0]:[60,0,0],LeftFoot:[0,0,0],RightUpLeg:r?[-30,0,-2]:[-4,0,-2],RightLeg:r?[60,0,0]:[4,0,0],RightFoot:[0,0,0],LeftArm:[0,0,10],RightArm:[0,0,-10]}),Lo={...je,RightUpLeg:[je.RightUpLeg[0]+14,je.RightUpLeg[1],je.RightUpLeg[2]],RightLeg:[72,0,0],RightFoot:[20,0,0]},Po={...je,LeftFoot:[je.LeftFoot[0]+38,0,0],LeftLeg:[2,0,0]},Do={idle:{loop:!0,keys:[{t:0,pose:he()},{t:.7,pose:he({Spine1:[4,10,0],LeftUpLeg:[-28,0,6],LeftLeg:[30,0,0],LeftForeArm:[-108,0,0],RightForeArm:[-118,0,0],Ponytail:[12,0,0]})},{t:1.4,pose:he()}]},ready:{keys:[{t:0,pose:he()},{t:.5,pose:he()}],events:Un(0)},apchagi:{keys:[{t:0,pose:he()},{t:.14,pose:he(ar)},{t:.3,pose:he(Yc)},{t:.44,ease:"snap",pose:he(je)},{t:.52,pose:he({...je,RightUpLeg:[je.RightUpLeg[0]+4,je.RightUpLeg[1],je.RightUpLeg[2]],RightLeg:[8,0,0]})},{t:.66,pose:he(Yc)},{t:.82,pose:he({...ar,RightUpLeg:[10,0,-6],RightLeg:[20,0,0]})},{t:.98,pose:he()}],events:[...Un(0,.3,.44,.66,.98),{time:.44,name:"impact"}]},naeryeo:{keys:[{t:0,pose:he()},{t:.14,pose:he(ar)},{t:.3,pose:he(Kd)},{t:.42,pose:he(Vi)},{t:.52,ease:"drop",pose:he(Co)},{t:.62,pose:he($d)},{t:.74,pose:he(Zc)},{t:.86,pose:he(Zc)},{t:1.08,pose:he()}],events:[...Un(0,.42,.52,.74,1.08),{time:.52,name:"impact"}]},yeop:{keys:[{t:0,pose:he()},{t:.14,pose:he(Jc)},{t:.32,pose:he(nh)},{t:.48,pose:he(Uo)},{t:.54,pose:he(Qd)},{t:.62,ease:"snap",pose:he(li)},{t:.68,pose:he({...li,RightLeg:[30,0,0]})},{t:.8,pose:he(ep)},{t:.94,pose:he({...Jc,RightUpLeg:[14,0,-6],RightLeg:[22,0,0]})},{t:1.1,pose:he()}],events:[...Un(0,.48,.62,.8,1.1),{time:.62,name:"impact"}]},"ap-ollyeo":{keys:[{t:0,pose:he()},{t:.12,pose:he(ar)},{t:.28,pose:he(Kc)},{t:.42,ease:"snap",pose:he(tp)},{t:.62,ease:"drop",pose:he({...Kc,RightUpLeg:[-40,0,-4],Spine:[2,4,0]})},{t:.9,pose:he()}],events:[...Un(0,.28,.42,.62,.9),{time:.42,name:"impact"}]},mireo:{keys:[{t:0,pose:he()},{t:.14,pose:he(ar)},{t:.34,pose:he($c)},{t:.5,ease:"snap",pose:he(Qc)},{t:.6,pose:he(Qc)},{t:.8,pose:he($c)},{t:1.05,pose:he()}],events:[...Un(0,.34,.5,.8,1.05),{time:.5,name:"impact"}]},hit:{keys:[{t:0,pose:he()},{t:.07,ease:"snap",pose:he(eh)},{t:.5,pose:he({...eh,Spine:[20,4,0],Spine1:[14,6,0]})},{t:.9,pose:he()}]},win:{keys:[{t:0,pose:he()},{t:.18,ease:"snap",pose:he(Ao)},{t:.9,pose:he({...Ao,Hips:[0,-6,0],Spine:[-8,0,0],RightArm:[-162,0,-30],RightForeArm:[-34,0,0],Head:[-12,0,0]})},{t:1.6,pose:he(Ao)},{t:1.8,pose:he()}]},bounce:{loop:!0,keys:[{t:0,pose:he({...wt,LeftUpLeg:[-26,0,6],LeftLeg:[24,0,0],LeftFoot:[4,0,0],RightUpLeg:[9.5,0,-6],RightLeg:[24,0,0],RightFoot:[-20.5,0,0],Spine1:[3,10,0],Ponytail:[10,0,0]})},{t:.29,pose:he({...wt,LeftUpLeg:[-19,0,6],LeftLeg:[10,0,0],LeftFoot:[18,0,0],RightUpLeg:[12.5,0,-6],RightLeg:[14,0,0],RightFoot:[-9,0,0],LeftForeArm:[-130,0,0],RightForeArm:[-136,0,0],Ponytail:[18,0,0]})},{t:.58,pose:he({...wt,LeftUpLeg:[-26,0,6],LeftLeg:[24,0,0],LeftFoot:[4,0,0],RightUpLeg:[9.5,0,-6],RightLeg:[24,0,0],RightFoot:[-20.5,0,0],Spine1:[3,10,0],Ponytail:[10,0,0]})}]},hit_head:{keys:[{t:0,pose:he()},{t:.06,ease:"snap",pose:he(th)},{t:.42,pose:he({...th,Neck:[-8,0,0],Head:[-12,8,0],Spine:[-10,4,0]})},{t:.9,pose:he()}]},walk:{loop:!0,anchor:"none",keys:[{t:0,ease:"lin",pose:Es},{t:.25,ease:"lin",pose:ih(0)},{t:.5,ease:"lin",pose:ip},{t:.75,ease:"lin",pose:ih(1)},{t:1,ease:"lin",pose:Es}]},bow:{anchor:"none",keys:[{t:0,pose:Wi},{t:.45,pose:Wi},{t:1.05,pose:{...Wi,Spine:[32,0,0],Spine1:[6,0,0],Neck:[6,0,0],Head:[10,0,0]}},{t:1.75,pose:{...Wi,Spine:[32,0,0],Spine1:[6,0,0],Neck:[6,0,0],Head:[10,0,0]}},{t:2.35,pose:Wi},{t:2.8,pose:Wi}]},coach_idle:{loop:!0,anchor:"none",keys:[{t:0,pose:wo},{t:1.6,pose:{...wo,Spine1:[-2,0,0],Head:[-4,4,0]}},{t:3.2,pose:wo}]},"err-ok":{keys:[{t:0,pose:he(je)},{t:.1,pose:he(je)}]},"err-head":{keys:[{t:0,pose:he({...je,Neck:[24,2,0],Head:[44,0,0]})},{t:.1,pose:he({...je,Neck:[24,2,0],Head:[44,0,0]})}]},"err-knee":{keys:[{t:0,pose:he(Lo)},{t:.1,pose:he(Lo)}]},"err-lean":{keys:[{t:0,pose:he({...je,Spine:[-40,4,0],Spine1:[-12,6,0],Head:[30,8,0]})},{t:.1,pose:he({...je,Spine:[-40,4,0],Spine1:[-12,6,0],Head:[30,8,0]})}]},"err-heel":{keys:[{t:0,pose:he(Po)},{t:.1,pose:he(Po)}]}},Ro={LeftArm:[8,0,14],LeftForeArm:[-22,0,0],RightArm:[10,0,-14],RightForeArm:[-26,0,0]},np={apchagi:{ok:je,head:{...je,Neck:[24,2,0],Head:[44,0,0]},knee:Lo,lean:{...je,Spine:[-40,4,0],Spine1:[-12,6,0],Head:[30,8,0]},heel:Po,guard:{...je,...Ro},pivot:{...je,LeftUpLeg:[-3,-56,1]},low:{...je,RightUpLeg:[-62,0,10]}},narochagi:{ok:Vi,knee:{...Vi,RightUpLeg:[-128,25,-1],RightLeg:[68,0,0],RightFoot:[10,0,0]},lean:{...Vi,Spine:[-44,11,0],Spine1:[-10,-6,0],Head:[30,4,0]},guard:{...Vi,...Ro},pivot:{...Vi,LeftUpLeg:[-2,-25,-6]},head:{...Vi,Neck:[26,8,-2],Head:[46,4,0]},"ok-hit":Co,toes:{...Co,RightFoot:[48,0,0],RightToeBase:[0,0,0]}},bakchagi3:{ok:li,pivot:{...li,LeftFoot:[2,-105,5]},knee:{...li,RightLeg:[72,0,0]},foot:{...li,RightFoot:[-30,0,0],RightToeBase:[-30,0,0]},guard:{...li,...Ro},head:{...li,Neck:[0,8,10],Head:[30,24,12]},lean:{...li,Spine:[62,-16,-9],Spine1:[12,-14,10]}}};for(let[r,e]of Object.entries(np))for(let[t,i]of Object.entries(e))Do[`err-${r}-${t}`]={keys:[{t:0,pose:he(i)},{t:.1,pose:he(i)}]};var Bt=Math.PI/180,rp={ease:r=>r<.5?4*r*r*r:1-Math.pow(-2*r+2,3)/2,snap:r=>1-Math.pow(1-r,4),drop:r=>Math.pow(r,2.4),lin:r=>r},lr=1024,mt=null,Ft=null,rh=!1,ze={scale:1,ema:0,MIN:.45,spent:0,budget:12,skipped:0,culled:0,armed:!1};function sp(){ze.armed||(ze.armed=!0,requestAnimationFrame(()=>{ze.spent=0,ze.armed=!1}))}function ap(r){ze.spent+=r,sp(),ze.renders=(ze.renders||0)+1,ze.ema=ze.ema?ze.ema*.85+r*.15:r,ze.ema>9&&ze.scale>ze.MIN?ze.scale=Math.max(ze.MIN,ze.scale*.9):ze.ema<3.5&&ze.scale<1&&(ze.scale=Math.min(1,ze.scale*1.05))}var op=ze;function Oo(){if(mt||rh)return mt;try{let r=document.createElement("canvas");mt=new $n({canvas:r,alpha:!0,antialias:!0,preserveDrawingBuffer:!1,premultipliedAlpha:!0}),mt.setPixelRatio(1),mt.setSize(lr,lr,!1),mt.setClearColor(0,0),mt.outputColorSpace=Je,mt.toneMapping=yo,mt.toneMappingExposure=1.08,mt.setScissorTest(!0),Ft=new Tn(-1,1,1,-1,.1,30),Ft.position.set(-10,0,0),Ft.lookAt(0,0,0);let e=document.createElement("canvas");e.width=e.height=4,mt.setViewport(0,0,4,4),mt.setScissor(0,0,4,4),mt.clear();let t=e.getContext("2d");if(t.drawImage(r,0,lr-4,4,4,0,0,4,4),t.getImageData(1,1,1,1).data[3]>8)throw mt.dispose(),new Error("WebGL frames come back opaque")}catch(r){console.warn("TKD3D: WebGL unavailable",r),mt=null,rh=!0}return mt}function sh(){return!!Oo()}var lp={boy:In,girl:qc,coach:jc},As={},Rs=class{constructor(e){this.ch=e,this.desc=lp[e];let t=To(this.desc);this.boneNames=Object.keys(t.bones),this.boneIndex=Object.fromEntries(this.boneNames.map((h,u)=>[h,u])),this.animations={};for(let[h,u]of Object.entries(Do)){let d=u.keys.map(y=>({t:y.t,ease:y.ease||"ease",q:this.boneNames.map(f=>{let v=y.pose[f]||Io[f]||[0,0,0];return new st().setFromEuler(new yn(v[0]*Bt,v[1]*Bt,v[2]*Bt,t.bones[f].rotation.order))})})),p=(u.events||[]).map(y=>({time:y.time,name:y.name,int:y.int??0,string:""})),g=Math.max(d[d.length-1].t,...p.map(y=>y.time)),_=p.find(y=>y.name==="impact"),m=p.filter(y=>y.name==="phase").sort((y,f)=>y.int-f.int).map(y=>y.time);this.animations[h]={name:h,keys:d,events:p,duration:g,loop:!!u.loop,anchor:u.anchor||"left",impact:_?_.time:null,phases:m}}let i=new Xi(this,t);Dn(this,this.animations.idle,0,i.local),i.anchor="none",i.updateWorld(),i.root.updateMatrixWorld(!0),this.anchorTarget=i.bones.LeftToeBase.getWorldPosition(new w);let n=i.bones.Ponytail,s=n?.parent;n&&s.remove(n);let a=new Dt().setFromObject(i.root);n&&s.add(n);let o=i.bones.LeftFoot.getWorldPosition(new w),l=i.bones.RightFoot.getWorldPosition(new w);this.floor=a.min.y,this.z0=(o.z+l.z)/2,this.K=1e3/(a.max.y-a.min.y);let c=i.bones.LeftToeBase.getWorldPosition(new w).sub(o);this.stanceFootYaw=Math.atan2(c.x,c.z)/Bt,this.extra={height:1e3,ankleB:[0,0],ankleF:[0,0]}}},or=new st;function Dn(r,e,t,i){let n=e.keys,s=0;for(;s<n.length-2&&t>n[s+1].t;)s++;let a=n[s],o=n[s+1]||a,l=o.t-a.t,c=l>0?Math.min(1,Math.max(0,(t-a.t)/l)):1,h=rp[o.ease](c);for(let u=0;u<a.q.length;u++)or.copy(a.q[u]).slerp(o.q[u],h),i[u*4]=or.x,i[u*4+1]=or.y,i[u*4+2]=or.z,i[u*4+3]=or.w;return i}var ft=new st,Nn=new st;function cp(r,e,t,i){for(let n=0;n<r.length;n+=4)ft.set(r[n],r[n+1],r[n+2],r[n+3]),Nn.set(e[n],e[n+1],e[n+2],e[n+3]),ft.slerp(Nn,t),i[n]=ft.x,i[n+1]=ft.y,i[n+2]=ft.z,i[n+3]=ft.w;return i}var Ts={footF:"RightFoot",footB:"LeftFoot",shinF:"RightLeg",shinB:"LeftLeg",thighF:"RightUpLeg",thighB:"LeftUpLeg",head:"Head",body:"Spine1",hip:"Hips",root:"Hips"},ot=new w,ci=new w,hp=new st,No={on:!0,color:"#3a3142"},Xi=class{constructor(e,t=null){this.data=e,this.is3D=!0;let{root:i,bones:n}=t||To(e.desc);if(this.root=i,this.bones=n,this.list=e.boneNames.map(l=>n[l]),this.local=new Float32Array(this.list.length*4),this.list.forEach((l,c)=>{this.local[c*4+3]=1}),this.anchor="left",this.viewYaw=0,this.viewPitch=0,this.mirror=!1,this.spring={a:0,v:0,prev:null},this.springs=[],n.Ponytail&&this.springs.push(Object.assign(this.spring,{bone:n.Ponytail,ref:n.Head,gz:40,gy:25,k:80,c:7,lim:40})),n.BeltTail&&this.springs.push({a:0,v:0,prev:null,bone:n.BeltTail,ref:n.BeltTail,gz:55,gy:30,k:110,c:6,lim:55,b:0,bv:0}),this.faceRig=this.root.userData.face||null,this.face={blink:0,next:1.5+Math.random()*2.5,mouth:"smile",key:""},this.faceRig)for(let l of this.faceRig.lashes)l.userData.y0=l.position.y;this.scene=new os,this.yaw=new Ke,this.yaw.rotation.order="ZYX",this.yaw.add(i),this.scene.add(this.yaw),this.scene.add(new ys("#fffaf4","#c3c8d4",1));let s=new Cn("#fff6ec",1.7);s.position.set(-3,4,2.5),this.scene.add(s);let a=new Cn("#e2ecff",.9);a.position.set(2,2.5,-3),this.scene.add(a);let o=new Cn("#fff4e6",.4);o.position.set(-2,1,-2),this.scene.add(o),this._cos=""}updateWorld(){let e=this.local;this.list.forEach((i,n)=>i.quaternion.set(e[n*4],e[n*4+1],e[n*4+2],e[n*4+3]));let t=this.bones.Hips;t.position.copy(t.userData.rest),this.root.scale.x=this.mirror?-1:1,this.yaw.rotation.y=0,this.root.updateMatrixWorld(!0),this.anchor==="left"&&this.data.anchorTarget&&(this.bones.LeftToeBase.getWorldPosition(ot),ci.copy(this.data.anchorTarget),this.mirror&&(ci.x=-ci.x),ci.sub(ot),this.mirror&&(ci.x=-ci.x),t.position.add(ci),this.root.updateMatrixWorld(!0)),this.groundToes()}groundToes(){for(let e of["Left","Right"]){let t=this.bones[e+"ToeBase"];if(!t||(t.getWorldPosition(ot),ot.y-this.data.floor>.05))continue;ci.set(0,0,1).applyQuaternion(t.getWorldQuaternion(hp));let i=Math.asin(Math.max(-1,Math.min(1,ci.y)));i<-.01&&(t.rotateX(i),t.updateMatrixWorld(!0))}}measure(e="heel"){this.root.updateMatrixWorld(!0);let t=G=>this.bones[G].getWorldPosition(new w),i=G=>new w(0,0,1).applyQuaternion(this.bones[G].getWorldQuaternion(new st)),n=G=>Math.round(G/Bt),s=this.mirror?-1:1,a=G=>Math.atan2(G.x*s,G.z)/Bt,o=t("RightUpLeg"),l=t("RightLeg"),c=t("RightFoot"),h=t("LeftUpLeg"),u=t("LeftLeg"),d=t("LeftFoot"),p=t("LeftToeBase"),g=(G,x,I)=>n(G.clone().sub(x).angleTo(I.clone().sub(x))),_=l.clone().sub(o),m=t("Neck").sub(t("Hips")),y=this.data.floor,f=G=>G.y-y,v=t("Spine"),b=t("Spine1"),R=t("Head"),M=[["knee",f(u)],["belly",f(v)],["chest",f(b)+.1],["shoulder",f(b)+.125],["face",f(R)+.14],["head",f(R)+.3]],A=e==="ball"?t("RightToeBase"):e==="instep"?t("RightFoot").add(t("RightToeBase")).multiplyScalar(.5):c,U="floor";for(let[G,x]of M)f(A)>=x-.05&&(U=G);let P=p.clone().sub(d);P.y=0;let B=Math.round(a(P)-this.data.stanceFootYaw);return B<-90&&(B+=360),{knee:g(o,l,c),supKnee:g(h,u,d),legs:n(_.angleTo(u.clone().sub(h))),thigh:n(Math.asin(_.y/_.length())),pivot:B,hips:Math.round(a(i("Hips"))),lean:n(Math.atan2(-m.z,m.y)),tilt:n(m.angleTo(new w(0,1,0))),toes:n(i("RightFoot").angleTo(i("RightToeBase"))),heelUp:Math.round((f(d)-f(p))*100)/100,foot:U,footH:Math.round(f(A)*this.data.K)}}stepSprings(e){if(!(e<=0||!this.springs.length)){e=Math.min(e,1/30);for(let t of this.springs){let i=t.ref.getWorldPosition(ot);if(t.prev){let n=(i.z-t.prev.z)/e,s=(i.y-t.prev.y)/e;if(t.v+=(n*t.gz-s*t.gy)*e*10,t.b!==void 0){let a=(i.x-t.prev.x)/e;t.bv+=a*30*e*10}}else t.prev=new w;t.prev.copy(i),t.v+=(-t.k*t.a-t.c*t.v)*e,t.a+=t.v*e,t.a=Math.max(-t.lim,Math.min(t.lim,t.a)),t.bone.rotateX(t.a*Bt),t.b!==void 0&&(t.bv+=(-t.k*t.b-t.c*t.bv)*e,t.b+=t.bv*e,t.b=Math.max(-30,Math.min(30,t.b)),t.bone.rotateZ(t.b*Bt))}this.root.updateMatrixWorld(!0)}}stepFace(e,t){let i=this.faceRig,n=this.face;if(!i)return;e>0&&(n.next-=e,n.blink>0?(n.blink-=e,n.blink<=0&&(n.blink=0)):n.next<=0&&(n.blink=.13,n.next=2.4+Math.random()*2.4,Math.random()<.18&&(n.next=.28)));let s=t==="ouch"?.25:n.blink>0?Math.max(.08,Math.abs(n.blink-.065)/.065):1,a=t==="kihap"?1.12:s,o=-(this.eyePitch||0)*.5*Bt;for(let c of i.eyes)c.scale.y=a,c.rotation.x=o;for(let c of i.lashes)c.scale.y=Math.max(.3,a),c.position.y=c.userData.y0-(1-Math.min(1,a))*.035;let l=t==="kihap"?.3:t==="ouch"?-.36:t==="cheer"?-.14:0;for(let c of i.brows)c.rotation.z=l*c.userData.sx,c.position.y=(c.userData.y0??=c.position.y)+(t==="ouch"||t==="cheer"?.012:t==="kihap"?-.008:0);i.smile.visible=t==="smile",i.open.visible=t==="kihap"||t==="cheer",i.open.scale.y=t==="cheer"?.8:1.15,i.open.scale.x=t==="cheer"?1.45:1,i.ouch.visible=t==="ouch",n.mouth=t,n.key=t+(a<.99?Math.round(a*4):"")+"|"+Math.round((this.eyePitch||0)/3)}toRig(e){let t=this.viewYaw;return t?{x:(-e.x*Math.sin(t)+e.z*Math.cos(t)-this.data.z0)*this.data.K,y:(e.y-this.data.floor)*this.data.K}:{x:(e.z-this.data.z0)*this.data.K,y:(e.y-this.data.floor)*this.data.K}}point(e,t=0,i=0){let n=this.bones[Ts[e]||e];return n?this.toRig(n.getWorldPosition(ot)):{x:0,y:0}}boneTip(e,t=1){let i=Ts[e]||e;if(i==="RightFoot"||i==="LeftFoot"){let n=t<.4?this.bones[i]:this.bones[i.replace("Foot","ToeBase")];return this.toRig(n.getWorldPosition(ot))}return this.point(i)}project(e){let t=this.bones[Ts[e]||e];return t?(t.getWorldPosition(ot),this._toScreen(ot)):{x:0,y:0}}_toScreen(e){let t=Math.cos(this.viewYaw),i=Math.sin(this.viewYaw),n=e.x*t+e.z*i,s=-e.x*i+e.z*t,a=this.viewPitch||0,o=a?n*Math.sin(a)+e.y*Math.cos(a):e.y;return{x:(s-this.data.z0)*this.data.K,y:(o-this.data.floor)*this.data.K}}toScreen(e){return this._toScreen(e)}world(e,t=0,i=0,n=0){let s=this.bones[Ts[e]||e];return s?(ot.set(t,i,n),s.localToWorld(ot),{x:ot.x,y:ot.y,z:ot.z}):null}dispose(){this.root.traverse(e=>{e.geometry&&e.geometry.dispose();let t=e.material;t&&(Array.isArray(t)?t:[t]).forEach(i=>!i.userData?.shared&&i.dispose&&i.dispose())}),this._cache=null,this.disposed=!0}projectAt(e,t=0,i=0,n=0){let s=this.bones[e];return s?(ot.set(t,i,n),s.localToWorld(ot),this._toScreen(ot)):{x:0,y:0}}angle(e,t,i){let n=this.bones[e].getWorldPosition(new w),s=this.bones[t].getWorldPosition(new w),a=this.bones[i].getWorldPosition(new w);return Math.round(n.sub(s).angleTo(a.sub(s))/Bt)}applyCosmetics(){if(this.data.ch==="coach"||this.noCosmetics)return;let e=typeof window<"u"&&window.Shop?.cosmetics?window.Shop.cosmetics():null,t=e?`${e.belt}|${e.headband}|${e.collar||""}`:"";if(t===this._cos)return;this._cos=t;let i=this.root.userData.mat,n=this.root.userData.headband;i.belt.color.set(e?.belt||this.data.desc.belt),i.collar&&i.collar.color.set(e?.collar||this.data.desc.collar||"#1d1d22"),n&&(n.visible=!!e?.headband,e?.headband&&n.material.color.set(e.headband))}draw(e,t,i,n,s=!1,a=1){let o=Oo();if(!o||a<=0)return;this.applyCosmetics();let l=this.data,c=l.K,h=l.z0-.95,u=l.z0+1.4,d=l.floor-.04,p=l.floor+1.95,g=t+(h-l.z0)*c*n,_=i-(p-l.floor)*c*n,m=(u-h)*c*n,y=(p-d)*c*n,f=e.getTransform(),v=Math.hypot(f.a,f.b)||1,b=Math.max(2,Math.round(m*v*ze.scale)),R=Math.max(2,Math.round(y*v*ze.scale)),M=Math.min(1,lr/Math.max(b,R));b=Math.round(b*M),R=Math.round(R*M);let A=e.canvas;if(A&&A.width){let G=[f.a*g+f.c*_+f.e,f.a*(g+m)+f.c*_+f.e,f.a*g+f.c*(_+y)+f.e,f.a*(g+m)+f.c*(_+y)+f.e],x=[f.b*g+f.d*_+f.f,f.b*(g+m)+f.d*_+f.f,f.b*g+f.d*(_+y)+f.f,f.b*(g+m)+f.d*(_+y)+f.f],I=s?2*(f.a*t+f.e):0,L=Math.min(...G),F=Math.max(...G),ie=s?Math.min(L,I-F):L;if((s?Math.max(F,I-L):F)<-4||ie>A.width+4||Math.max(...x)<-4||Math.min(...x)>A.height+4){ze.culled++;return}}let U=this._cache||(this._cache={cv:document.createElement("canvas"),tmp:document.createElement("canvas"),pose:new Float32Array(this.local.length),yaw:NaN,pw:0,ph:0,cos:null,sp:new Float32Array(4),face:"",mir:!1}),P=this.springs,B=U.pw===b&&U.ph===R&&Math.abs(U.yaw-this.viewYaw)<.002&&Math.abs((U.pitch||0)-this.viewPitch)<.002&&U.cos===this._cos&&U.face===this.face.key&&U.mir===this.mirror;if(B){for(let G=0;G<P.length;G++)if(Math.abs(U.sp[G*2]-P[G].a)>.4||Math.abs(U.sp[G*2+1]-(P[G].b||0))>.4){B=!1;break}}if(B){for(let G=0;G<this.local.length;G++)if(Math.abs(this.local[G]-U.pose[G])>.0025){B=!1;break}}if(!B&&U.pw===b&&U.ph===R&&ze.spent>ze.budget&&!U.stale?(U.stale=!0,ze.skipped++,B=!0):B||(U.stale=!1),!B){let G=performance.now();Ft.left=h,Ft.right=u,Ft.top=p,Ft.bottom=d,Ft.position.set(-10,0,0),Ft.updateProjectionMatrix(),this.yaw.rotation.y=this.viewYaw,this.yaw.rotation.z=this.viewPitch,this.root.scale.x=this.mirror?-1:1,this.yaw.updateMatrixWorld(!0),o.setViewport(0,0,b,R),o.setScissor(0,0,b,R),o.clear(),o.render(this.scene,Ft),this.yaw.rotation.y=0,this.yaw.rotation.z=0,this.yaw.updateMatrixWorld(!0),(U.cv.width!==b||U.cv.height!==R)&&(U.cv.width=b,U.cv.height=R,U.tmp.width=b,U.tmp.height=R);let x=U.tmp.getContext("2d");x.clearRect(0,0,b,R),x.drawImage(o.domElement,0,lr-R,b,R,0,0,b,R);let I=U.cv.getContext("2d");I.clearRect(0,0,b,R);let L=No.on?Math.max(1,Math.min(2,R/360)):0;if(L){for(let F=0;F<8;F++){let ie=F*Math.PI/4;I.drawImage(U.tmp,Math.cos(ie)*L,Math.sin(ie)*L)}I.globalCompositeOperation="source-in",I.fillStyle=No.color,I.fillRect(0,0,b,R),I.globalCompositeOperation="source-over"}I.drawImage(U.tmp,0,0),U.pose.set(this.local),U.yaw=this.viewYaw,U.pitch=this.viewPitch,U.pw=b,U.ph=R,U.cos=this._cos,U.face=this.face.key,U.mir=this.mirror;for(let F=0;F<P.length;F++)U.sp[F*2]=P[F].a,U.sp[F*2+1]=P[F].b||0;ap(performance.now()-G)}e.save(),e.globalAlpha*=a,s&&(e.translate(t,0),e.scale(-1,1),e.translate(-t,0)),e.drawImage(U.cv,0,0,b,R,g,_,m,y),e.restore()}},ah={apchagi:"x","ap-ollyeo":"x",mireo:"x",yeop:"z"};function oh(r,e,t){let i=r.local,n=(s,a,o)=>{let l=r.data.boneIndex[s];if(l===void 0||!o)return;let c=l*4;Nn.setFromAxisAngle(a,o*Bt),ft.set(i[c],i[c+1],i[c+2],i[c+3]).premultiply(Nn),i[c]=ft.x,i[c+1]=ft.y,i[c+2]=ft.z,i[c+3]=ft.w};n("RightUpLeg",e==="z"?up:ws,-t),t>0&&e==="x"&&(n("Spine",ws,-t*.32),n("Head",ws,t*.25))}var ws=new w(1,0,0),up=new w(0,0,1),Cs=class{constructor(e){this.sk=e,this.data=e.data,this.cur=null,this.time=0,this.loop=!1,this.speed=1,this.from=null,this.mix=0,this.mixDur=0,this.hold=null,this.onEvent=null,this.onComplete=null,this._tmp=new Float32Array(e.local.length),this.aim=0,this.holdTime=0,this.look=0,this.lookTo=0,this.iHead=this.data.boneIndex.Head,this.iNeck=this.data.boneIndex.Neck,this.iThigh=this.data.boneIndex.RightUpLeg}mouth(){let e=this.curName,t=this.data.animations[e],i=this.cur?this.time:this.holdTime;return t?t.impact!==null&&!this.hold&&i>t.impact-.07&&i<t.impact+.34?"kihap":(e==="hit"||e==="hit_head")&&i<.6?"ouch":e==="win"&&i>.08&&i<1.65?"cheer":"smile":"smile"}applyLook(e){this.look+=(this.lookTo-this.look)*Math.min(1,e*8);let t=this.sk.local,i=this.look;if(!(Math.abs(i)<.3))for(let[n,s]of[[this.iHead,.55],[this.iNeck,.3]])n!==void 0&&(Nn.setFromAxisAngle(ws,-i*s*Bt),ft.set(t[n*4],t[n*4+1],t[n*4+2],t[n*4+3]).premultiply(Nn),t[n*4]=ft.x,t[n*4+1]=ft.y,t[n*4+2]=ft.z,t[n*4+3]=ft.w)}applyAim(){let e=this.cur,t=e&&ah[this.curName];if(!t||!this.aim||e.impact===null)return;let i=e.phases,n=this.time,s=(i[1]??e.impact-.15)-.1,a=e.impact,o=(i[3]??e.impact+.2)+.06,l=n<=s||n>=o?0:n<a?(n-s)/(a-s):1-(n-a)/(o-a);l=l*l*(3-2*l),!(l<=0)&&oh(this.sk,t,this.aim*l)}play(e,{loop:t=!1,mix:i=.15,speed:n=1,from:s=0,until:a=null}={}){let o=this.data.animations[e];return o?(this.from=this.cur||this.hold?this.snapshot():null,this.mix=0,this.mixDur=this.from?i:0,this.cur=o,this.curName=e,this.time=s,this.loop=t,this.speed=n,this.hold=null,this._done=!1,this.until=a,this.sk.anchor=o.anchor,!0):!1}pose(e,t,i=.25){let n=this.data.animations[e];if(!n)return!1;let s=Dn(this.data,n,t,new Float32Array(this.sk.local.length));return this.from=this.cur||this.hold?this.snapshot():null,this.mix=0,this.mixDur=this.from?i:0,this.hold=s,this.cur=null,this.curName=e,this.holdTime=t,this.sk.anchor=n.anchor,!0}snapshot(){return Float32Array.from(this.sk.local)}update(e){let t=this.sk;if(this.hold)t.local.set(this.hold);else if(this.cur){let i=this.time;this.time+=e*this.speed;let n=this.cur.duration||1e-4;for(let s of this.cur.events)s.time>i&&s.time<=this.time&&this.onEvent&&this.onEvent(s,this.curName);this.until!==null&&this.until!==void 0&&this.time>=this.until?(this.time=this.until,Dn(this.data,this.cur,this.time,t.local),this.applyAim(),this.hold=Float32Array.from(t.local),this.holdTime=this.time,this.cur=null,this.until=null,this.onComplete&&this.onComplete(this.curName)):this.time>=n&&(this.loop?this.time%=n:this._done||(this._done=!0,this.time=n,this.onComplete&&this.onComplete(this.curName))),this.cur&&(Dn(this.data,this.cur,this.time,t.local),this.applyAim())}if(this.from&&this.mix<this.mixDur){this.mix+=e;let i=Math.min(1,this.mix/this.mixDur),n=i*i*(3-2*i);this._tmp.set(t.local),cp(this.from,this._tmp,n,t.local),i>=1&&(this.from=null)}this.applyLook(e),t.eyePitch=this.look,t.updateWorld(),t.stepSprings(e),t.stepFace(e,this.mouth())}phaseTimes(e){return(this.data.animations[e]?.events||[]).filter(t=>t.name==="phase").sort((t,i)=>t.int-i.int).map(t=>t.time)}};function lh(r,e,t,i=0){let n=r.data.animations[e];if(!n)return!1;Dn(r.data,n,t,r.local);let s=i&&ah[e];return s&&oh(r,s,i),r.anchor=n.anchor,r.updateWorld(),r.stepFace(0,n.impact!==null&&Math.abs(t-n.impact)<.2?"kihap":"smile"),!0}var ch={apchagi:"apchagi",narochagi:"naeryeo",bakchagi3:"yeop","ap-ollyeo-chagi":"ap-ollyeo","mireo-chagi":"mireo"};function hh(r,e){let t=ch[e];return t&&r?.animations[t]?t:null}function dp(){let r=Oo();if(!r)return!1;for(let e of["boy","girl","coach"]){let t=As[e]||(As[e]=new Rs(e)),i=new Xi(t);Dn(t,t.animations.idle,0,i.local),i.updateWorld();try{r.compile(i.scene,Ft)}catch{}r.setViewport(0,0,8,8),r.setScissor(0,0,8,8),r.clear(),r.render(i.scene,Ft)}return!0}function pp(r){if(!sh())return null;r=r==="girl"||r==="coach"?r:"boy";let e=As[r]||(As[r]=new Rs(r)),t=new Xi(e),i=new Cs(t);return i.play("idle",{loop:!0,mix:0}),i.update(0),{data:e,skeleton:t,player:i,is3D:!0,newSkeleton:()=>new Xi(e),poseAt:lh,kickAnim:(n,s)=>hh(n,s)}}return Th(mp);})();
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
