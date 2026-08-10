const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Domestic-CdIuBT3Z.js","assets/index-C38H4Qxj.js","assets/index-L-dj7_2K.css","assets/International-DFXJ3y3d.js"])))=>i.map(i=>d[i]);
import{r as U,a as y,j as e,L as M,F as et,b as Le,c as Ve,d as Ge,e as ne,f as tt,g as qe,h as ge,i as se,k as it,l as rt,m as xe,n as ye,o as ot,p as Ye,q as we,s as $e,t as at,R as D,A as nt,u as st,v as lt,w as H,H as dt,x as Ue,N as ct,B as pt,T as ht,y as mt,z as He,C as ft,D as ut,E as gt,G as je,I as xt,J as Xe,K as yt,M as bt,O as vt,P as wt,_ as Ke}from"./index-C38H4Qxj.js";var Z={},Y={},T={},ce={},Se;function be(){return Se||(Se=1,(function(a){function c(i,s,h){var g=s.slidesToShow,u=s.currentSlide;return h.length>2*g?i+2*g:u>=h.length?h.length+i:i}function d(i,s){if(s.length>2*i){for(var h={},g=s.length-2*i,u=s.length-g,p=g,o=0;o<u;o++)h[o]=p,p++;var r=s.length+u,t=r+s.slice(0,2*i).length,f=0;for(o=r;o<=t;o++)h[o]=f,f++;var x=r,b=0;for(o=u;o<x;o++)h[o]=b,b++;return h}h={};var v=3*s.length,w=0;for(o=0;o<v;o++)h[o]=w,++w===s.length&&(w=0);return h}function m(i,s){return s.length<i?s:s.length>2*i?s.slice(s.length-2*i,s.length).concat(s,s.slice(0,2*i)):s.concat(s,s)}function l(i,s){return s.length>2*i?2*i:s.length}function n(i,s,h){var g,u=i.currentSlide,p=i.slidesToShow,o=i.itemWidth,r=i.totalItems,t=0,f=0,x=u===0,b=s.length-(s.length-2*p);return s.length<p?(f=t=0,x=g=!1):s.length>2*p?((g=u>=b+s.length)&&(f=-o*(t=u-s.length)),x&&(f=-o*(t=b+(s.length-2*p)))):((g=u>=2*s.length)&&(f=-o*(t=u-s.length)),x&&(f=h.showDots?-o*(t=s.length):-o*(t=r/3))),{isReachingTheEnd:g,isReachingTheStart:x,nextSlide:t,nextPosition:f}}Object.defineProperty(a,"__esModule",{value:!0}),a.getOriginalCounterPart=c,a.getOriginalIndexLookupTableByClones=d,a.getClones=m,a.getInitialSlideInInfiniteMode=l,a.checkClonesPosition=n})(ce)),ce}var $={},ke;function Qe(){if(ke)return $;ke=1,Object.defineProperty($,"__esModule",{value:!0});function a(m,l,n,i){var s=0,h=i||n;return l&&h&&(s=m[h].partialVisibilityGutter||m[h].paritialVisibilityGutter),s}function c(m,l){var n;return l[m]&&(n=(100/l[m].items).toFixed(1)),n}function d(m,l,n){return Math.round(n/(l+(m.centerMode?1:0)))}return $.getPartialVisibilityGutter=a,$.getWidthFromDeviceType=c,$.getItemClientSideWidth=d,$}var N={},Te;function G(){if(Te)return N;Te=1,Object.defineProperty(N,"__esModule",{value:!0});var a=Qe();function c(p){var o=p.slidesToShow;return p.totalItems<o}function d(p,o){var r,t=p.domLoaded,f=p.slidesToShow,x=p.containerWidth,b=p.itemWidth,v=o.deviceType,w=o.responsive,j=o.ssr,S=o.partialVisbile,k=o.partialVisible,F=!!(t&&f&&x&&b);j&&v&&!F&&(r=a.getWidthFromDeviceType(v,w));var C=!!(j&&v&&!F&&r);return{shouldRenderOnSSR:C,flexBisis:r,domFullyLoaded:F,partialVisibilityGutter:a.getPartialVisibilityGutter(w,S||k,v,p.deviceType),shouldRenderAtAll:C||F}}function m(p,o){var r=o.currentSlide,t=o.slidesToShow;return r<=p&&p<r+t}function l(p,o,r){var t=r||p.transform;return!o.infinite&&p.currentSlide===0||c(p)?t:t+p.itemWidth/2}function n(p){return!(0<p.currentSlide)}function i(p){var o=p.currentSlide,r=p.totalItems;return!(o+p.slidesToShow<r)}function s(p,o,r,t){o===void 0&&(o=0);var f=p.currentSlide,x=p.slidesToShow,b=i(p),v=!r.infinite&&b,w=t||p.transform;if(c(p))return w;var j=w+f*o;return v?j+(p.containerWidth-(p.itemWidth-o)*x):j}function h(p,o){return p.rtl?-1*o:o}function g(p,o,r){var t=o.partialVisbile,f=o.partialVisible,x=o.responsive,b=o.deviceType,v=o.centerMode,w=r||p.transform,j=a.getPartialVisibilityGutter(x,t||f,b,p.deviceType);return h(o,f||t?s(p,j,o,r):v?l(p,o,r):w)}function u(p,o){var r=p.domLoaded,t=p.slidesToShow,f=p.containerWidth,x=p.itemWidth,b=o.deviceType,v=o.responsive,w=o.slidesToSlide||1,j=!!(r&&t&&f&&x);return o.ssr&&o.deviceType&&!j&&Object.keys(v).forEach(function(S){var k=v[S].slidesToSlide;b===S&&k&&(w=k)}),j&&Object.keys(v).forEach(function(S){var k=v[S],F=k.breakpoint,C=k.slidesToSlide,A=F.max,E=F.min;C&&window.innerWidth>=E&&window.innerWidth<=A&&(w=C)}),w}return N.notEnoughChildren=c,N.getInitialState=d,N.getIfSlideIsVisbile=m,N.getTransformForCenterMode=l,N.isInLeftEnd=n,N.isInRightEnd=i,N.getTransformForPartialVsibile=s,N.parsePosition=h,N.getTransform=g,N.getSlidesToSlide=u,N}var ee={},Ce;function jt(){if(Ce)return ee;Ce=1,Object.defineProperty(ee,"__esModule",{value:!0});var a=function(c,d,m){var l;return function(){var n=arguments;l||(c.apply(this,n),l=!0,typeof m=="function"&&m(!0),setTimeout(function(){l=!1,typeof m=="function"&&m(!1)},d))}};return ee.default=a,ee}var pe={},Ie;function St(){return Ie||(Ie=1,(function(a){function c(d,m){var l=m.partialVisbile,n=m.partialVisible,i=m.centerMode,s=m.ssr,h=m.responsive;if((l||n)&&i)throw new Error("center mode can not be used at the same time with partialVisible");if(!h)throw s?new Error("ssr mode need to be used in conjunction with responsive prop"):new Error("Responsive prop is needed for deciding the amount of items to show on the screen");if(h&&typeof h!="object")throw new Error("responsive prop must be an object")}Object.defineProperty(a,"__esModule",{value:!0}),a.default=c})(pe)),pe}var te={},Fe;function kt(){if(Fe)return te;Fe=1,Object.defineProperty(te,"__esModule",{value:!0});var a=G();function c(d,m,l){l===void 0&&(l=0);var n,i,s=d.slidesToShow,h=d.currentSlide,g=d.itemWidth,u=d.totalItems,p=a.getSlidesToSlide(d,m),o=h+1+l+s+(0<l?0:p);return i=o<=u?-g*(n=h+l+(0<l?0:p)):u<o&&h!==u-s?-g*(n=u-s):n=void 0,{nextSlides:n,nextPosition:i}}return te.populateNextSlides=c,te}var ie={},Ee;function Tt(){if(Ee)return ie;Ee=1,Object.defineProperty(ie,"__esModule",{value:!0});var a=U(),c=G(),d=G();function m(l,n,i){i===void 0&&(i=0);var s,h,g=l.currentSlide,u=l.itemWidth,p=l.slidesToShow,o=n.children,r=n.showDots,t=n.infinite,f=c.getSlidesToSlide(l,n),x=g-i-(0<i?0:f),b=(a.Children.toArray(o).length-p)%f;return h=0<=x?(s=x,r&&!t&&0<b&&d.isInRightEnd(l)&&(s=g-b),-u*s):s=x<0&&g!==0?0:void 0,{nextSlides:s,nextPosition:h}}return ie.populatePreviousSlides=m,ie}var he={},Ne;function Ct(){return Ne||(Ne=1,(function(a){function c(d,m,l,n,i,s){var h,g,u=d.itemWidth,p=d.slidesToShow,o=d.totalItems,r=d.currentSlide,t=m.infinite,f=!1,x=Math.round((l-n)/u),b=Math.round((n-l)/u),v=l<i;if(i<l&&x<=p){h="right";var w=Math.abs(-u*(o-p)),j=s-(n-i),S=r===o-p;(Math.abs(j)<=w||S&&t)&&(g=j,f=!0)}return v&&b<=p&&(h="left",((j=s+(i-n))<=0||r===0&&t)&&(f=!0,g=j)),{direction:h,nextPosition:g,canContinue:f}}Object.defineProperty(a,"__esModule",{value:!0}),a.populateSlidesOnMouseTouchMove=c})(he)),he}var Re;function Je(){if(Re)return T;Re=1,Object.defineProperty(T,"__esModule",{value:!0});var a=be();T.getOriginalCounterPart=a.getOriginalCounterPart,T.getClones=a.getClones,T.checkClonesPosition=a.checkClonesPosition,T.getInitialSlideInInfiniteMode=a.getInitialSlideInInfiniteMode;var c=Qe();T.getWidthFromDeviceType=c.getWidthFromDeviceType,T.getPartialVisibilityGutter=c.getPartialVisibilityGutter,T.getItemClientSideWidth=c.getItemClientSideWidth;var d=G();T.getInitialState=d.getInitialState,T.getIfSlideIsVisbile=d.getIfSlideIsVisbile,T.getTransformForCenterMode=d.getTransformForCenterMode,T.getTransformForPartialVsibile=d.getTransformForPartialVsibile,T.isInLeftEnd=d.isInLeftEnd,T.isInRightEnd=d.isInRightEnd,T.notEnoughChildren=d.notEnoughChildren,T.getSlidesToSlide=d.getSlidesToSlide;var m=jt();T.throttle=m.default;var l=St();T.throwError=l.default;var n=kt();T.populateNextSlides=n.populateNextSlides;var i=Tt();T.populatePreviousSlides=i.populatePreviousSlides;var s=Ct();return T.populateSlidesOnMouseTouchMove=s.populateSlidesOnMouseTouchMove,T}var V={},Ae;function It(){if(Ae)return V;Ae=1;var a=V&&V.__extends||(function(){var l=function(n,i){return(l=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(s,h){s.__proto__=h}||function(s,h){for(var g in h)h.hasOwnProperty(g)&&(s[g]=h[g])})(n,i)};return function(n,i){function s(){this.constructor=n}l(n,i),n.prototype=i===null?Object.create(i):(s.prototype=i.prototype,new s)}})();Object.defineProperty(V,"__esModule",{value:!0});var c=U();function d(l){return"clientY"in l}V.isMouseMoveEvent=d;var m=(function(l){function n(){return l!==null&&l.apply(this,arguments)||this}return a(n,l),n})(c.Component);return V.default=m,V}var re={},oe={},ze;function Ft(){if(ze)return oe;ze=1,Object.defineProperty(oe,"__esModule",{value:!0});var a=be(),c=G();function d(m,l,n,i){var s={},h=c.getSlidesToSlide(l,n);return Array(m).fill(0).forEach(function(g,u){var p=a.getOriginalCounterPart(u,l,i);if(u===0)s[0]=p;else{var o=s[u-1]+h;s[u]=o}}),s}return oe.getLookupTableForNextSlides=d,oe}var Be;function Et(){if(Be)return re;Be=1,Object.defineProperty(re,"__esModule",{value:!0});var a=U(),c=be(),d=Ft(),m=G(),l=function(n){var i=n.props,s=n.state,h=n.goToSlide,g=n.getState,u=i.showDots,p=i.customDot,o=i.dotListClass,r=i.infinite,t=i.children;if(!u||m.notEnoughChildren(s))return null;var f,x=s.currentSlide,b=s.slidesToShow,v=m.getSlidesToSlide(s,i),w=a.Children.toArray(t);f=r?Math.ceil(w.length/v):Math.ceil((w.length-b)/v)+1;var j=d.getLookupTableForNextSlides(f,s,i,w),S=c.getOriginalIndexLookupTableByClones(b,w),k=S[x];return a.createElement("ul",{className:"react-multi-carousel-dot-list "+o},Array(f).fill(0).map(function(F,C){var A,E;if(r){E=j[C];var W=S[E];A=k===W||W<=k&&k<W+v}else{var P=w.length-b,R=C*v;A=(E=P<R?P:R)===x||E<x&&x<E+v&&x<w.length-b}return p?a.cloneElement(p,{index:C,active:A,key:C,onClick:function(){return h(E)},carouselState:g()}):a.createElement("li",{"data-index":C,key:C,className:"react-multi-carousel-dot "+(A?"react-multi-carousel-dot--active":"")},a.createElement("button",{"aria-label":"Go to slide "+(C+1),onClick:function(){return h(E)}}))}))};return re.default=l,re}var X={},Me;function Nt(){if(Me)return X;Me=1,Object.defineProperty(X,"__esModule",{value:!0});var a=U(),c=function(m){var l=m.customLeftArrow,n=m.getState,i=m.previous,s=m.disabled,h=m.rtl;if(l)return a.cloneElement(l,{onClick:function(){return i()},carouselState:n(),disabled:s,rtl:h});var g=h?"rtl":"";return a.createElement("button",{"aria-label":"Go to previous slide",className:"react-multiple-carousel__arrow react-multiple-carousel__arrow--left "+g,onClick:function(){return i()},type:"button",disabled:s})};X.LeftArrow=c;var d=function(m){var l=m.customRightArrow,n=m.getState,i=m.next,s=m.disabled,h=m.rtl;if(l)return a.cloneElement(l,{onClick:function(){return i()},carouselState:n(),disabled:s,rtl:h});var g=h?"rtl":"";return a.createElement("button",{"aria-label":"Go to next slide",className:"react-multiple-carousel__arrow react-multiple-carousel__arrow--right "+g,onClick:function(){return i()},type:"button",disabled:s})};return X.RightArrow=d,X}var ae={},De;function Rt(){if(De)return ae;De=1,Object.defineProperty(ae,"__esModule",{value:!0});var a=U(),c=Je(),d=function(m){var l=m.props,n=m.state,i=m.goToSlide,s=m.clones,h=m.notEnoughChildren,g=n.itemWidth,u=l.children,p=l.infinite,o=l.itemClass,r=l.itemAriaLabel,t=l.partialVisbile,f=l.partialVisible,x=c.getInitialState(n,l),b=x.flexBisis,v=x.shouldRenderOnSSR,w=x.domFullyLoaded,j=x.partialVisibilityGutter;return x.shouldRenderAtAll?(t&&console.warn('WARNING: Please correct props name: "partialVisible" as old typo will be removed in future versions!'),a.createElement(a.Fragment,null,(p?s:a.Children.toArray(u)).map(function(S,k){return a.createElement("li",{key:k,"data-index":k,onClick:function(){l.focusOnSelect&&i(k)},"aria-hidden":c.getIfSlideIsVisbile(k,n)?"false":"true","aria-label":r||(S.props.ariaLabel?S.props.ariaLabel:null),style:{flex:v?"1 0 "+b+"%":"auto",position:"relative",width:w?((t||f)&&j&&!h?g-j:g)+"px":"auto"},className:"react-multi-carousel-item "+(c.getIfSlideIsVisbile(k,n)?"react-multi-carousel-item--active":"")+" "+o},S)}))):null};return ae.default=d,ae}var We;function At(){if(We)return Y;We=1;var a=Y&&Y.__extends||(function(){var p=function(o,r){return(p=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,f){t.__proto__=f}||function(t,f){for(var x in f)f.hasOwnProperty(x)&&(t[x]=f[x])})(o,r)};return function(o,r){function t(){this.constructor=o}p(o,r),o.prototype=r===null?Object.create(r):(t.prototype=r.prototype,new t)}})();Object.defineProperty(Y,"__esModule",{value:!0});var c=U(),d=Je(),m=It(),l=Et(),n=Nt(),i=Rt(),s=G(),h=400,g="transform 400ms ease-in-out",u=(function(p){function o(r){var t=p.call(this,r)||this;return t.containerRef=c.createRef(),t.listRef=c.createRef(),t.state={itemWidth:0,slidesToShow:0,currentSlide:0,totalItems:c.Children.count(r.children),deviceType:"",domLoaded:!1,transform:0,containerWidth:0},t.onResize=t.onResize.bind(t),t.handleDown=t.handleDown.bind(t),t.handleMove=t.handleMove.bind(t),t.handleOut=t.handleOut.bind(t),t.onKeyUp=t.onKeyUp.bind(t),t.handleEnter=t.handleEnter.bind(t),t.setIsInThrottle=t.setIsInThrottle.bind(t),t.next=d.throttle(t.next.bind(t),r.transitionDuration||h,t.setIsInThrottle),t.previous=d.throttle(t.previous.bind(t),r.transitionDuration||h,t.setIsInThrottle),t.goToSlide=d.throttle(t.goToSlide.bind(t),r.transitionDuration||h,t.setIsInThrottle),t.onMove=!1,t.initialX=0,t.lastX=0,t.isAnimationAllowed=!1,t.direction="",t.initialY=0,t.isInThrottle=!1,t.transformPlaceHolder=0,t}return a(o,p),o.prototype.resetTotalItems=function(){var r=this,t=c.Children.count(this.props.children),f=d.notEnoughChildren(this.state)?0:Math.max(0,Math.min(this.state.currentSlide,t));this.setState({totalItems:t,currentSlide:f},function(){r.setContainerAndItemWidth(r.state.slidesToShow,!0)})},o.prototype.setIsInThrottle=function(r){r===void 0&&(r=!1),this.isInThrottle=r},o.prototype.setTransformDirectly=function(r,t){var f=this.props.additionalTransfrom;this.transformPlaceHolder=r;var x=s.getTransform(this.state,this.props,this.transformPlaceHolder);this.listRef&&this.listRef.current&&(this.setAnimationDirectly(t),this.listRef.current.style.transform="translate3d("+(x+f)+"px,0,0)")},o.prototype.setAnimationDirectly=function(r){this.listRef&&this.listRef.current&&(this.listRef.current.style.transition=r?this.props.customTransition||g:"none")},o.prototype.componentDidMount=function(){this.setState({domLoaded:!0}),this.setItemsToShow(),window.addEventListener("resize",this.onResize),this.onResize(!0),this.props.keyBoardControl&&window.addEventListener("keyup",this.onKeyUp),this.props.autoPlay&&(this.autoPlay=setInterval(this.next,this.props.autoPlaySpeed))},o.prototype.setClones=function(r,t,f,x){var b=this;x===void 0&&(x=!1),this.isAnimationAllowed=!1;var v=c.Children.toArray(this.props.children),w=d.getInitialSlideInInfiniteMode(r||this.state.slidesToShow,v),j=d.getClones(this.state.slidesToShow,v),S=v.length<this.state.slidesToShow?0:this.state.currentSlide;this.setState({totalItems:j.length,currentSlide:f&&!x?S:w},function(){b.correctItemsPosition(t||b.state.itemWidth)})},o.prototype.setItemsToShow=function(r,t){var f=this,x=this.props.responsive;Object.keys(x).forEach(function(b){var v=x[b],w=v.breakpoint,j=v.items,S=w.max,k=w.min,F=[window.innerWidth];window.screen&&window.screen.width&&F.push(window.screen.width);var C=Math.min.apply(Math,F);k<=C&&C<=S&&(f.setState({slidesToShow:j,deviceType:b}),f.setContainerAndItemWidth(j,r,t))})},o.prototype.setContainerAndItemWidth=function(r,t,f){var x=this;if(this.containerRef&&this.containerRef.current){var b=this.containerRef.current.offsetWidth,v=d.getItemClientSideWidth(this.props,r,b);this.setState({containerWidth:b,itemWidth:v},function(){x.props.infinite&&x.setClones(r,v,t,f)}),t&&this.correctItemsPosition(v)}},o.prototype.correctItemsPosition=function(r,t,f){t&&(this.isAnimationAllowed=!0),!t&&this.isAnimationAllowed&&(this.isAnimationAllowed=!1);var x=this.state.totalItems<this.state.slidesToShow?0:-r*this.state.currentSlide;f&&this.setTransformDirectly(x,!0),this.setState({transform:x})},o.prototype.onResize=function(r){var t;t=!!this.props.infinite&&(typeof r!="boolean"||!r),this.setItemsToShow(t)},o.prototype.componentDidUpdate=function(r,t){var f=this,x=r.keyBoardControl,b=r.autoPlay,v=r.children,w=t.containerWidth,j=t.domLoaded,S=t.currentSlide;if(this.containerRef&&this.containerRef.current&&this.containerRef.current.offsetWidth!==w&&(this.itemsToShowTimeout&&clearTimeout(this.itemsToShowTimeout),this.itemsToShowTimeout=setTimeout(function(){f.setItemsToShow(!0)},this.props.transitionDuration||h)),x&&!this.props.keyBoardControl&&window.removeEventListener("keyup",this.onKeyUp),!x&&this.props.keyBoardControl&&window.addEventListener("keyup",this.onKeyUp),b&&!this.props.autoPlay&&this.autoPlay&&(clearInterval(this.autoPlay),this.autoPlay=void 0),b||!this.props.autoPlay||this.autoPlay||(this.autoPlay=setInterval(this.next,this.props.autoPlaySpeed)),v.length!==this.props.children.length?o.clonesTimeout=setTimeout(function(){f.props.infinite?f.setClones(f.state.slidesToShow,f.state.itemWidth,!0,!0):f.resetTotalItems()},this.props.transitionDuration||h):this.props.infinite&&this.state.currentSlide!==S&&this.correctClonesPosition({domLoaded:j}),this.transformPlaceHolder!==this.state.transform&&(this.transformPlaceHolder=this.state.transform),this.props.autoPlay&&this.props.rewind&&!this.props.infinite&&d.isInRightEnd(this.state)){var k=this.props.transitionDuration||h;o.isInThrottleTimeout=setTimeout(function(){f.setIsInThrottle(!1),f.resetAutoplayInterval(),f.goToSlide(0,void 0,!!f.props.rewindWithAnimation)},k+this.props.autoPlaySpeed)}},o.prototype.correctClonesPosition=function(r){var t=this,f=r.domLoaded,x=c.Children.toArray(this.props.children),b=d.checkClonesPosition(this.state,x,this.props),v=b.isReachingTheEnd,w=b.isReachingTheStart,j=b.nextSlide,S=b.nextPosition;this.state.domLoaded&&f&&(v||w)&&(this.isAnimationAllowed=!1,o.transformTimeout=setTimeout(function(){t.setState({transform:S,currentSlide:j})},this.props.transitionDuration||h))},o.prototype.next=function(r){var t=this;r===void 0&&(r=0);var f=this.props,x=f.afterChange,b=f.beforeChange;if(!d.notEnoughChildren(this.state)){var v=d.populateNextSlides(this.state,this.props,r),w=v.nextSlides,j=v.nextPosition,S=this.state.currentSlide;w!==void 0&&j!==void 0&&(typeof b=="function"&&b(w,this.getState()),this.isAnimationAllowed=!0,this.props.shouldResetAutoplay&&this.resetAutoplayInterval(),this.setState({transform:j,currentSlide:w},function(){typeof x=="function"&&(o.afterChangeTimeout=setTimeout(function(){x(S,t.getState())},t.props.transitionDuration||h))}))}},o.prototype.previous=function(r){var t=this;r===void 0&&(r=0);var f=this.props,x=f.afterChange,b=f.beforeChange;if(!d.notEnoughChildren(this.state)){var v=d.populatePreviousSlides(this.state,this.props,r),w=v.nextSlides,j=v.nextPosition;if(w!==void 0&&j!==void 0){var S=this.state.currentSlide;typeof b=="function"&&b(w,this.getState()),this.isAnimationAllowed=!0,this.props.shouldResetAutoplay&&this.resetAutoplayInterval(),this.setState({transform:j,currentSlide:w},function(){typeof x=="function"&&(o.afterChangeTimeout2=setTimeout(function(){x(S,t.getState())},t.props.transitionDuration||h))})}}},o.prototype.resetAutoplayInterval=function(){this.props.autoPlay&&(clearInterval(this.autoPlay),this.autoPlay=setInterval(this.next,this.props.autoPlaySpeed))},o.prototype.componentWillUnmount=function(){window.removeEventListener("resize",this.onResize),this.props.keyBoardControl&&window.removeEventListener("keyup",this.onKeyUp),this.props.autoPlay&&this.autoPlay&&(clearInterval(this.autoPlay),this.autoPlay=void 0),this.itemsToShowTimeout&&clearTimeout(this.itemsToShowTimeout),o.clonesTimeout&&clearTimeout(o.clonesTimeout),o.isInThrottleTimeout&&clearTimeout(o.isInThrottleTimeout),o.transformTimeout&&clearTimeout(o.transformTimeout),o.afterChangeTimeout&&clearTimeout(o.afterChangeTimeout),o.afterChangeTimeout2&&clearTimeout(o.afterChangeTimeout2),o.afterChangeTimeout3&&clearTimeout(o.afterChangeTimeout3)},o.prototype.resetMoveStatus=function(){this.onMove=!1,this.initialX=0,this.lastX=0,this.direction="",this.initialY=0},o.prototype.getCords=function(r){var t=r.clientX,f=r.clientY;return{clientX:s.parsePosition(this.props,t),clientY:s.parsePosition(this.props,f)}},o.prototype.handleDown=function(r){if(!(!m.isMouseMoveEvent(r)&&!this.props.swipeable||m.isMouseMoveEvent(r)&&!this.props.draggable||this.isInThrottle)){var t=this.getCords(m.isMouseMoveEvent(r)?r:r.touches[0]),f=t.clientX,x=t.clientY;this.onMove=!0,this.initialX=f,this.initialY=x,this.lastX=f,this.isAnimationAllowed=!1}},o.prototype.handleMove=function(r){if(!(!m.isMouseMoveEvent(r)&&!this.props.swipeable||m.isMouseMoveEvent(r)&&!this.props.draggable||d.notEnoughChildren(this.state))){var t=this.getCords(m.isMouseMoveEvent(r)?r:r.touches[0]),f=t.clientX,x=t.clientY,b=this.initialX-f,v=this.initialY-x;if(this.onMove){if(!(Math.abs(b)>Math.abs(v)))return;var w=d.populateSlidesOnMouseTouchMove(this.state,this.props,this.initialX,this.lastX,f,this.transformPlaceHolder),j=w.direction,S=w.nextPosition,k=w.canContinue;j&&(this.direction=j,k&&S!==void 0&&this.setTransformDirectly(S)),this.lastX=f}}},o.prototype.handleOut=function(r){this.props.autoPlay&&!this.autoPlay&&(this.autoPlay=setInterval(this.next,this.props.autoPlaySpeed));var t=r.type==="touchend"&&!this.props.swipeable,f=(r.type==="mouseleave"||r.type==="mouseup")&&!this.props.draggable;if(!t&&!f&&this.onMove){if(this.setAnimationDirectly(!0),this.direction==="right")if(this.initialX-this.lastX>=this.props.minimumTouchDrag){var x=Math.round((this.initialX-this.lastX)/this.state.itemWidth);this.next(x)}else this.correctItemsPosition(this.state.itemWidth,!0,!0);this.direction==="left"&&(this.lastX-this.initialX>this.props.minimumTouchDrag?(x=Math.round((this.lastX-this.initialX)/this.state.itemWidth),this.previous(x)):this.correctItemsPosition(this.state.itemWidth,!0,!0)),this.resetMoveStatus()}},o.prototype.isInViewport=function(r){var t=r.getBoundingClientRect(),f=t.top,x=f===void 0?0:f,b=t.left,v=b===void 0?0:b,w=t.bottom,j=w===void 0?0:w,S=t.right,k=S===void 0?0:S;return 0<=x&&0<=v&&j<=(window.innerHeight||document.documentElement.clientHeight)&&k<=(window.innerWidth||document.documentElement.clientWidth)},o.prototype.isChildOfCarousel=function(r){return!!(r instanceof Element&&this.listRef&&this.listRef.current)&&this.listRef.current.contains(r)},o.prototype.onKeyUp=function(r){var t=r.target;switch(r.keyCode){case 37:if(this.isChildOfCarousel(t))return this.previous();break;case 39:if(this.isChildOfCarousel(t))return this.next();break;case 9:if(this.isChildOfCarousel(t)&&t instanceof HTMLInputElement&&this.isInViewport(t))return this.next()}},o.prototype.handleEnter=function(r){m.isMouseMoveEvent(r)&&this.autoPlay&&this.props.autoPlay&&this.props.pauseOnHover&&(clearInterval(this.autoPlay),this.autoPlay=void 0)},o.prototype.goToSlide=function(r,t,f){var x=this;if(f===void 0&&(f=!0),!this.isInThrottle){var b=this.state.itemWidth,v=this.props,w=v.afterChange,j=v.beforeChange,S=this.state.currentSlide;typeof j!="function"||t&&(typeof t!="object"||t.skipBeforeChange)||j(r,this.getState()),this.isAnimationAllowed=f,this.props.shouldResetAutoplay&&this.resetAutoplayInterval(),this.setState({currentSlide:r,transform:-b*r},function(){x.props.infinite&&x.correctClonesPosition({domLoaded:!0}),typeof w!="function"||t&&(typeof t!="object"||t.skipAfterChange)||(o.afterChangeTimeout3=setTimeout(function(){w(S,x.getState())},x.props.transitionDuration||h))})}},o.prototype.getState=function(){return this.state},o.prototype.renderLeftArrow=function(r){var t=this,f=this.props,x=f.customLeftArrow,b=f.rtl;return c.createElement(n.LeftArrow,{customLeftArrow:x,getState:function(){return t.getState()},previous:this.previous,disabled:r,rtl:b})},o.prototype.renderRightArrow=function(r){var t=this,f=this.props,x=f.customRightArrow,b=f.rtl;return c.createElement(n.RightArrow,{customRightArrow:x,getState:function(){return t.getState()},next:this.next,disabled:r,rtl:b})},o.prototype.renderButtonGroups=function(){var r=this,t=this.props.customButtonGroup;return t?c.cloneElement(t,{previous:function(){return r.previous()},next:function(){return r.next()},goToSlide:function(f,x){return r.goToSlide(f,x)},carouselState:this.getState()}):null},o.prototype.renderDotsList=function(){var r=this;return c.createElement(l.default,{state:this.state,props:this.props,goToSlide:this.goToSlide,getState:function(){return r.getState()}})},o.prototype.renderCarouselItems=function(){var r=[];if(this.props.infinite){var t=c.Children.toArray(this.props.children);r=d.getClones(this.state.slidesToShow,t)}return c.createElement(i.default,{clones:r,goToSlide:this.goToSlide,state:this.state,notEnoughChildren:d.notEnoughChildren(this.state),props:this.props})},o.prototype.render=function(){var r=this.props,t=r.deviceType,f=r.arrows,x=r.renderArrowsWhenDisabled,b=r.removeArrowOnDeviceType,v=r.infinite,w=r.containerClass,j=r.sliderClass,S=r.customTransition,k=r.additionalTransfrom,F=r.renderDotsOutside,C=r.renderButtonGroupOutside,A=r.className,E=r.rtl,W=d.getInitialState(this.state,this.props),P=W.shouldRenderOnSSR,R=W.shouldRenderAtAll,K=d.isInLeftEnd(this.state),le=d.isInRightEnd(this.state),_=f&&!(b&&(t&&-1<b.indexOf(t)||this.state.deviceType&&-1<b.indexOf(this.state.deviceType)))&&!d.notEnoughChildren(this.state)&&R,Q=!v&&K,J=!v&&le,de=s.getTransform(this.state,this.props);return c.createElement(c.Fragment,null,c.createElement("div",{className:"react-multi-carousel-list "+w+" "+A,dir:E?"rtl":"ltr",ref:this.containerRef},c.createElement("ul",{ref:this.listRef,className:"react-multi-carousel-track "+j,style:{transition:this.isAnimationAllowed?S||g:"none",overflow:P?"hidden":"unset",transform:"translate3d("+(de+k)+"px,0,0)"},onMouseMove:this.handleMove,onMouseDown:this.handleDown,onMouseUp:this.handleOut,onMouseEnter:this.handleEnter,onMouseLeave:this.handleOut,onTouchStart:this.handleDown,onTouchMove:this.handleMove,onTouchEnd:this.handleOut},this.renderCarouselItems()),_&&(!Q||x)&&this.renderLeftArrow(Q),_&&(!J||x)&&this.renderRightArrow(J),R&&!C&&this.renderButtonGroups(),R&&!F&&this.renderDotsList()),R&&F&&this.renderDotsList(),R&&C&&this.renderButtonGroups())},o.defaultProps={slidesToSlide:1,infinite:!1,draggable:!0,swipeable:!0,arrows:!0,renderArrowsWhenDisabled:!1,containerClass:"",sliderClass:"",itemClass:"",keyBoardControl:!0,autoPlaySpeed:3e3,showDots:!1,renderDotsOutside:!1,renderButtonGroupOutside:!1,minimumTouchDrag:80,className:"",dotListClass:"",focusOnSelect:!1,centerMode:!1,additionalTransfrom:0,pauseOnHover:!0,shouldResetAutoplay:!0,rewind:!1,rtl:!1,rewindWithAnimation:!1},o})(c.Component);return Y.default=u,Y}var Oe;function zt(){if(Oe)return Z;Oe=1,Object.defineProperty(Z,"__esModule",{value:!0});var a=At();return Z.default=a.default,Z}var me,Pe;function Bt(){return Pe||(Pe=1,me=zt()),me}Bt();const Mt=()=>{const[a,c]=y.useState({bookings:247,online:38});return y.useEffect(()=>{const d=setInterval(()=>{c(m=>({bookings:m.bookings+Math.floor(Math.random()*2),online:Math.max(20,m.online+Math.floor((Math.random()-.45)*5))}))},7e3);return()=>clearInterval(d)},[]),a},Dt=()=>{const[a,c]=y.useState(""),[d,m]=y.useState(!1),[l,n]=y.useState(""),i=Mt(),s=[{label:"Custom Tours",path:"/tourcard/custom-tour"},{label:"Adventure Tours",path:"/tourcard/adventure-tour"},{label:"Family Tours",path:"/tourcard/family-tour"},{label:"Honeymoon Tours",path:"/tourcard/honeymoon-tour"},{label:"Luxury Tours",path:"/tourcard/luxury-tour"},{label:"Pilgrimage Tours",path:"/tourcard/pilgrimage-tour"},{label:"Weekend Getaways",path:"/tourcard/weekend-getaway"},{label:"Group Tours",path:"/tourcard/group-tour"},{label:"City Tours",path:"/tourcard/city-tour"}],h=[{label:"🏖️ Goa",path:"/goa"},{label:"🌴 Kerala",path:"/kerala"},{label:"🏜️ Rajasthan",path:"/rajasthan"},{label:"🏔️ Himachal",path:"/himachal"},{label:"🌆 Dubai",path:"/dubai"},{label:"🏝️ Maldives",path:"/maldives"},{label:"🐘 Thailand",path:"/thailand"},{label:"🌺 Bali",path:"/bali"}],g=[{label:"About Us",path:"/#about-us"},{label:"Our Services",path:"/services"},{label:"Career",path:"/career"},{label:"Blog",path:"/blog"},{label:"Privacy Policy",path:"/privacy-policy"},{label:"Terms",path:"/terms"},{label:"Cancellation",path:"/cancellation"},{label:"Sitemap",path:"/sitemap"}];return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@500;600;700&display=swap');
        :root {
          --font-body: 'DM Sans', sans-serif;
          --font-display: 'Cormorant Garamond', serif;
          --navy: #10102a;
          --navy-mid: #1a1a3e;
          --indigo: #3D52A0;
          --gold: #C9A84C;
          --gold-light: #F0D080;
          --ease: cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Live strip ── */
        .ftr-live-strip {
          background: linear-gradient(90deg, var(--navy) 0%, var(--indigo) 50%, var(--navy) 100%);
          background-size: 200% 100%;
          animation: ftr-shimmer 8s linear infinite;
          padding: 0.6rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        @keyframes ftr-shimmer { 0%{background-position:0%} 100%{background-position:200%} }
        .ftr-live-item {
          display: flex; align-items: center; gap: 7px;
          color: rgba(255,255,255,0.85);
          font-size: 0.8rem;
          font-family: var(--font-body);
        }
        .ftr-live-dot {
          width: 7px; height: 7px;
          background: #4CAF50;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.2);
          animation: ftr-pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes ftr-pulse { 0%,100%{box-shadow:0 0 0 3px rgba(76,175,80,0.2)} 50%{box-shadow:0 0 0 6px rgba(76,175,80,0.08)} }

        /* ── Main footer ── */
        .ftr-main {
          background: var(--navy);
          padding: 5rem 2rem 2rem;
          font-family: var(--font-body);
        }
        .ftr-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* Top row */
        .ftr-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        /* Brand column */
        .ftr-brand-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: 1.25rem;
        }
        .ftr-brand-logo img { height: 42px; filter: brightness(0) invert(1); }
        .ftr-brand-name {
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 700; color: white;
        }
        .ftr-brand-name .accent { color: var(--gold); }
        .ftr-brand-tagline {
          font-size: 0.88rem; color: rgba(255,255,255,0.5);
          line-height: 1.7; margin-bottom: 1.5rem; max-width: 320px;
        }
        .ftr-socials { display: flex; gap: 10px; margin-bottom: 1.75rem; }
        .ftr-social-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.25s var(--ease);
        }
        .ftr-social-btn:hover {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--navy);
          transform: translateY(-2px);
        }

        /* Contact items in brand */
        .ftr-contact-list { display: flex; flex-direction: column; gap: 10px; }
        .ftr-contact-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.84rem; color: rgba(255,255,255,0.55);
          text-decoration: none; transition: color 0.2s;
        }
        .ftr-contact-item:hover { color: var(--gold-light); }
        .ftr-contact-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
          color: var(--gold);
        }

        /* Link columns */
        .ftr-col-title {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 6px;
        }
        .ftr-col-title::after {
          content: '';
          flex: 1; height: 1px;
          background: rgba(201,168,76,0.25);
        }
        .ftr-col-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .ftr-col-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: all 0.2s var(--ease);
          padding: 2px 0;
        }
        .ftr-col-link:hover {
          color: rgba(255,255,255,0.9);
          transform: translateX(4px);
        }
        .ftr-link-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--indigo); flex-shrink: 0;
          transition: background 0.2s;
        }
        .ftr-col-link:hover .ftr-link-dot { background: var(--gold); }

        /* Newsletter section */
        .ftr-newsletter {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 3rem;
        }
        .ftr-newsletter-inner {
          display: flex;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .ftr-newsletter-left { flex: 1; min-width: 240px; }
        .ftr-newsletter-title {
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 700; color: white;
          margin-bottom: 0.5rem;
        }
        .ftr-newsletter-sub { font-size: 0.85rem; color: rgba(255,255,255,0.5); line-height: 1.6; }
        .ftr-newsletter-right { flex: 1; min-width: 300px; }
        .ftr-form { display: flex; flex-direction: column; gap: 8px; }
        .ftr-email-row {
          display: flex;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .ftr-email-row:focus-within { border-color: var(--gold); }
        .ftr-email-input {
          flex: 1; padding: 0.8rem 1.25rem;
          background: transparent; border: none; outline: none;
          color: white;
          font-size: 0.88rem; font-family: var(--font-body);
          placeholder-color: rgba(255,255,255,0.4);
        }
        .ftr-email-input::placeholder { color: rgba(255,255,255,0.35); }
        .ftr-email-btn {
          padding: 0 1.5rem;
          background: var(--gold);
          border: none; cursor: pointer;
          color: var(--navy);
          font-weight: 700; font-size: 0.85rem;
          font-family: var(--font-body);
          display: flex; align-items: center; gap: 6px;
          transition: background 0.2s;
        }
        .ftr-email-btn:hover { background: var(--gold-light); }
        .ftr-error { font-size: 0.78rem; color: #FF6B6B; }
        .ftr-success {
          display: flex; align-items: center; gap: 8px;
          background: rgba(76,175,80,0.12);
          border: 1px solid rgba(76,175,80,0.25);
          border-radius: 10px;
          padding: 0.7rem 1rem;
          font-size: 0.85rem; color: #81C784;
          font-family: var(--font-body);
        }

        /* Payments */
        .ftr-payments {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 0.75rem; flex-wrap: wrap;
        }
        .ftr-payments-label { font-size: 0.75rem; color: rgba(255,255,255,0.35); }
        .ftr-payment-icon {
          font-size: 1.4rem;
          color: rgba(255,255,255,0.45);
          transition: color 0.2s;
        }
        .ftr-payment-icon:hover { color: rgba(255,255,255,0.8); }

        /* Divider */
        .ftr-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin: 0 0 2rem;
        }

        /* Bottom bar */
        .ftr-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .ftr-copyright {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
        }
        .ftr-copyright strong { color: rgba(255,255,255,0.6); }
        .ftr-made-with {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.78rem; color: rgba(255,255,255,0.3);
        }
        .ftr-made-with svg { color: #FF6B6B; animation: ftr-heartbeat 1.5s infinite; }
        @keyframes ftr-heartbeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        .ftr-bottom-links {
          display: flex; gap: 1.5rem; flex-wrap: wrap;
        }
        .ftr-bottom-link {
          font-size: 0.78rem; color: rgba(255,255,255,0.3);
          text-decoration: none; transition: color 0.2s;
        }
        .ftr-bottom-link:hover { color: var(--gold); }

        @media (max-width: 1024px) {
          .ftr-top { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .ftr-top { grid-template-columns: 1fr; gap: 2rem; }
          .ftr-newsletter-inner { flex-direction: column; gap: 1.5rem; }
          .ftr-bottom { flex-direction: column; text-align: center; }
          .ftr-live-strip { gap: 1rem; font-size: 0.75rem; }
        }
      `}),e.jsxs("div",{className:"ftr-live-strip",children:[e.jsxs("div",{className:"ftr-live-item",children:[e.jsx("span",{className:"ftr-live-dot"}),e.jsxs("span",{children:[e.jsx("strong",{style:{color:"white"},children:i.online})," travelers browsing right now"]})]}),e.jsxs("div",{className:"ftr-live-item",children:[e.jsx("span",{children:"🎉"}),e.jsxs("span",{children:[e.jsx("strong",{style:{color:"white"},children:i.bookings})," bookings made today"]})]}),e.jsxs("div",{className:"ftr-live-item",children:[e.jsx("span",{children:"⭐"}),e.jsxs("span",{children:["Rated ",e.jsx("strong",{style:{color:"white"},children:"4.9/5"})," by 10,000+ travelers"]})]}),e.jsxs("div",{className:"ftr-live-item",children:[e.jsx("span",{children:"🔒"}),e.jsx("span",{children:"100% Secure & Insured Travel"})]})]}),e.jsx("footer",{className:"ftr-main",id:"footer",children:e.jsxs("div",{className:"ftr-inner",children:[e.jsxs("div",{className:"ftr-top",children:[e.jsxs("div",{children:[e.jsxs(M,{to:"/",className:"ftr-brand-logo",children:[e.jsx("img",{src:"/logo.png",alt:"DesiVDesi"}),e.jsxs("span",{className:"ftr-brand-name",children:["Desi",e.jsx("span",{className:"accent",children:"V"}),"Desi"]})]}),e.jsx("p",{className:"ftr-brand-tagline",children:"Crafting unforgettable journeys across India's hidden gems and the world's most iconic destinations since 2009."}),e.jsx("div",{className:"ftr-socials",children:[{icon:e.jsx(et,{}),href:"#",label:"Facebook"},{icon:e.jsx(Le,{}),href:"#",label:"Instagram"},{icon:e.jsx(Ve,{}),href:"#",label:"Twitter"},{icon:e.jsx(Ge,{}),href:"#",label:"YouTube"},{icon:e.jsx(ne,{}),href:"https://wa.me/917888251550",label:"WhatsApp"}].map(u=>e.jsx("a",{href:u.href,className:"ftr-social-btn",target:"_blank",rel:"noreferrer","aria-label":u.label,children:u.icon},u.label))}),e.jsxs("div",{className:"ftr-contact-list",children:[e.jsxs("a",{href:"tel:+917888251550",className:"ftr-contact-item",children:[e.jsx("span",{className:"ftr-contact-icon",children:e.jsx(tt,{})}),"+91 78882 51550"]}),e.jsxs("a",{href:"https://wa.me/917888251550",className:"ftr-contact-item",children:[e.jsx("span",{className:"ftr-contact-icon",children:e.jsx(ne,{})}),"WhatsApp Support"]}),e.jsxs("a",{href:"mailto:tours.desivdesi@gmail.com",className:"ftr-contact-item",children:[e.jsx("span",{className:"ftr-contact-icon",children:e.jsx(qe,{})}),"tours.desivdesi@gmail.com"]}),e.jsxs("div",{className:"ftr-contact-item",children:[e.jsx("span",{className:"ftr-contact-icon",children:e.jsx(ge,{})}),"123 Travel St, Mumbai 400001"]})]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"ftr-col-title",children:"Tour Packages"}),e.jsx("ul",{className:"ftr-col-links",children:s.map(u=>e.jsx("li",{children:e.jsxs(M,{to:u.path,className:"ftr-col-link",children:[e.jsx("span",{className:"ftr-link-dot"}),u.label]})},u.label))})]}),e.jsxs("div",{children:[e.jsx("div",{className:"ftr-col-title",children:"Destinations"}),e.jsx("ul",{className:"ftr-col-links",children:h.map(u=>e.jsx("li",{children:e.jsxs(M,{to:u.path,className:"ftr-col-link",children:[e.jsx("span",{className:"ftr-link-dot"}),u.label]})},u.label))})]}),e.jsxs("div",{children:[e.jsx("div",{className:"ftr-col-title",children:"Quick Links"}),e.jsx("ul",{className:"ftr-col-links",children:g.map(u=>e.jsx("li",{children:e.jsxs(M,{to:u.path,className:"ftr-col-link",children:[e.jsx("span",{className:"ftr-link-dot"}),u.label]})},u.label))})]})]}),e.jsx("div",{className:"ftr-divider"}),e.jsxs("div",{className:"ftr-bottom",children:[e.jsxs("p",{className:"ftr-copyright",children:["© ",new Date().getFullYear()," ",e.jsx("strong",{children:"Desi V Desi Travel"}),". All rights reserved."]}),e.jsxs("div",{className:"ftr-made-with",children:["Made with ",e.jsx(se,{size:11})," in India"]}),e.jsxs("div",{className:"ftr-bottom-links",children:[e.jsx(M,{to:"/privacy-policy",className:"ftr-bottom-link",children:"Privacy Policy"}),e.jsx(M,{to:"/terms",className:"ftr-bottom-link",children:"Terms"}),e.jsx(M,{to:"/cookies",className:"ftr-bottom-link",children:"Cookies"}),e.jsx(M,{to:"/sitemap",className:"ftr-bottom-link",children:"Sitemap"})]})]})]})})]})},Wt={Breakfast:"☕",Lunch:"🍱",Dinner:"🍽️"},_e={budget:{bg:"#ECFDF5",color:"#059669"},"mid-range":{bg:"#EFF6FF",color:"#2563EB"},premium:{bg:"#FEF3C7",color:"#D97706"},luxury:{bg:"#FDF2F8",color:"#9333EA"}};function Ot(a=""){const c=parseInt(a.split(":")[0],10);return c<12?{label:"Morning",emoji:"🌅"}:c<17?{label:"Afternoon",emoji:"☀️"}:{label:"Evening",emoji:"🌙"}}const Pt=[{key:"itinerary",label:"Itinerary",icon:e.jsx($e,{})},{key:"hotels",label:"Hotels",icon:e.jsx(Ye,{})},{key:"budget",label:"Budget",icon:e.jsx(ye,{})},{key:"tips",label:"Local Tips",icon:e.jsx(at,{})}];function _t(a){const c=encodeURIComponent(`Check out my AI-planned trip to ${a}! 🌍✈️ Planned with Desi V Desi Tours`);window.open(`https://wa.me/?text=${c}`,"_blank")}function Lt(a){const c=a.days||[],d=[`TRIP ITINERARY — ${a.destination}`,"─".repeat(50),`Theme: ${a.summary||""}`,`Nights: ${a.nights} | Travelers: ${a.travelers} | Budget: ${a.budget}`,"",...c.flatMap(n=>[`DAY ${n.day}: ${n.title}`,...(n.activities||[]).map(i=>`  ${i.time}  ${i.name} — ${i.description} (${i.cost})`),"","Meals:",...(n.food||[]).map(i=>`  ${i.meal}: ${i.place} — ${i.description} (${i.cost})`),"",n.stay?`Stay: ${n.stay.name} (${n.stay.type}) ${n.stay.cost}`:"No stay tonight",`Estimated day cost: ${n.dayCostEstimate}`,""]),"TIPS",...(a.tips||[]).map(n=>`• ${n}`)],m=new Blob([d.join(`
`)],{type:"text/plain"}),l=document.createElement("a");l.href=URL.createObjectURL(m),l.download=`itinerary-${(a.destination||"trip").replace(/[^a-z0-9]/gi,"-").toLowerCase()}.txt`,l.click()}function Vt({itinerary:a,onPlanAgain:c}){const[d,m]=y.useState("itinerary"),[l,n]=y.useState(0);if(!a)return null;const i=a.itinerary??a,s=i.days||[],h=s[l];return e.jsxs("div",{style:{fontFamily:"Outfit, sans-serif"},children:[e.jsxs("div",{className:"trip-header",style:{marginBottom:28},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:16},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.6)",marginBottom:6},children:"AI-Generated Itinerary ✨"}),e.jsx("h1",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:700,color:"white",lineHeight:1.1,marginBottom:0},children:i.destination})]}),e.jsxs("div",{style:{display:"flex",gap:8,flexShrink:0},children:[e.jsxs("button",{onClick:()=>_t(i.destination),style:{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",background:"#25D366",border:"none",borderRadius:10,color:"white",fontFamily:"Outfit",fontSize:"0.8rem",fontWeight:600,cursor:"pointer"},children:[e.jsx(ne,{})," Share"]}),e.jsxs("button",{onClick:()=>Lt(i),style:{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:10,color:"white",fontFamily:"Outfit",fontSize:"0.8rem",fontWeight:600,cursor:"pointer"},children:[e.jsx(it,{})," Save"]})]})]}),e.jsxs("div",{className:"trip-meta",children:[i.checkin&&e.jsxs("span",{className:"meta-badge",children:["📅 ",i.checkin," → ",i.checkout]}),i.nights&&e.jsxs("span",{className:"meta-badge",children:[e.jsx(rt,{style:{marginRight:5}}),i.nights," Nights"]}),i.travelers&&e.jsxs("span",{className:"meta-badge",children:[e.jsx(xe,{style:{marginRight:5}}),i.travelers," Traveler",i.travelers>1?"s":""]}),i.budget&&e.jsxs("span",{className:"meta-badge",children:[i.budget," Budget"]}),i.tripType&&e.jsx("span",{className:"meta-badge",children:i.tripType})]}),(i.summary||i.theme)&&e.jsxs("p",{className:"trip-summary",style:{fontStyle:"italic",marginBottom:16},children:["✦ ",i.summary||i.theme]}),(i.totalCostEstimate||i.bestTimeToVisit)&&e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:8},children:[i.totalCostEstimate&&e.jsxs("span",{style:{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:20,padding:"4px 14px",fontSize:"0.78rem",fontWeight:500,color:"white"},children:["💰 ",i.totalCostEstimate]}),i.bestTimeToVisit&&e.jsxs("span",{style:{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:20,padding:"4px 14px",fontSize:"0.78rem",fontWeight:500,color:"white"},children:["🗓 Best: ",i.bestTimeToVisit]})]})]}),e.jsx("div",{style:{display:"flex",gap:4,borderBottom:"2px solid #E5E7EB",marginBottom:28,overflowX:"auto"},children:Pt.map(g=>e.jsxs("button",{onClick:()=>m(g.key),style:{display:"flex",alignItems:"center",gap:7,padding:"10px 18px",background:"none",border:"none",fontFamily:"Outfit",fontSize:"0.85rem",fontWeight:d===g.key?700:500,color:d===g.key?"var(--saffron-dark)":"#6B7280",borderBottom:d===g.key?"2px solid var(--saffron)":"2px solid transparent",marginBottom:-2,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s"},children:[g.icon," ",g.label]},g.key))}),d==="itinerary"&&e.jsxs("div",{children:[e.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24},children:s.map((g,u)=>e.jsxs("button",{onClick:()=>n(u),style:{padding:"7px 16px",borderRadius:10,border:"1.5px solid",borderColor:l===u?"var(--saffron)":"#E5E7EB",background:l===u?"var(--saffron)":"white",color:l===u?"white":"#6B7280",fontFamily:"Outfit",fontSize:"0.82rem",fontWeight:600,cursor:"pointer",transition:"all 0.2s"},children:["Day ",g.day]},u))}),h&&e.jsxs("div",{className:"day-card",children:[e.jsxs("div",{className:"day-header",children:[e.jsx("div",{className:"day-num",children:h.day}),e.jsx("div",{className:"day-title",children:h.title})]}),(h.activities||[]).map((g,u)=>{const p=Ot(g.time);return e.jsxs("div",{style:{padding:"18px 24px",borderBottom:"1px solid #F3F4F6"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:8},children:[e.jsx("span",{style:{fontSize:"1.1rem"},children:p.emoji}),e.jsx("span",{style:{fontFamily:"Outfit",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9CA3AF"},children:p.label}),e.jsx("span",{style:{marginLeft:"auto",fontSize:"0.75rem",color:"#9CA3AF"},children:g.time})]}),e.jsx("div",{style:{fontWeight:600,fontSize:"0.95rem",color:"var(--ink)",marginBottom:6},children:g.name}),e.jsx("div",{style:{fontSize:"0.83rem",color:"#6B7280",lineHeight:1.55,marginBottom:8},children:g.description}),e.jsx("div",{style:{display:"flex",gap:18,fontSize:"0.8rem",color:"#9CA3AF"},children:g.cost&&e.jsxs("span",{style:{display:"flex",alignItems:"center",gap:4,background:"#F0FDF4",color:"#16A34A",fontWeight:600,padding:"2px 10px",borderRadius:6},children:[e.jsx(ye,{style:{fontSize:"0.7rem"}}),g.cost]})})]},u)}),h.food?.length>0&&e.jsxs("div",{style:{padding:"16px 24px"},children:[e.jsxs("div",{style:{fontFamily:"Outfit",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9CA3AF",marginBottom:12,display:"flex",alignItems:"center",gap:6},children:[e.jsx(ot,{})," Meals"]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:h.food.map((g,u)=>e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:12,fontSize:"0.85rem"},children:[e.jsx("span",{style:{minWidth:24,fontSize:"1rem"},children:Wt[g.meal]||"🍴"}),e.jsxs("div",{style:{flex:1},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8},children:[e.jsx("span",{style:{fontWeight:700,color:"#374151"},children:g.place}),e.jsx("span",{style:{fontSize:"0.75rem",color:"#9CA3AF",whiteSpace:"nowrap"},children:g.meal})]}),e.jsx("div",{style:{color:"#6B7280",lineHeight:1.5,marginTop:2},children:g.description}),g.cost&&e.jsx("div",{style:{fontSize:"0.75rem",color:"#16A34A",fontWeight:600,marginTop:4},children:g.cost})]})]},u))})]}),h.stay&&e.jsxs("div",{style:{margin:"0 24px 20px",background:"linear-gradient(135deg,#FFF7ED,#FEF3C7)",border:"1px solid #FDE68A",borderRadius:12,padding:"14px 16px"},children:[e.jsxs("div",{style:{fontFamily:"Outfit",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#D97706",marginBottom:8,display:"flex",alignItems:"center",gap:6},children:[e.jsx(Ye,{})," Tonight's Stay"]}),e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.05rem",fontWeight:700,color:"var(--ink)",marginBottom:2},children:h.stay.name}),e.jsxs("div",{style:{display:"flex",gap:12,fontSize:"0.8rem",color:"#92400E"},children:[e.jsx("span",{children:h.stay.type}),h.stay.cost&&e.jsx("span",{style:{fontWeight:600},children:h.stay.cost})]})]}),h.dayCostEstimate&&e.jsxs("div",{style:{margin:"0 24px 20px",background:"#F9FAFB",borderRadius:10,padding:"10px 16px",fontSize:"0.83rem",color:"#374151",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{color:"#9CA3AF",fontWeight:600},children:"Estimated Day Cost (per person)"}),e.jsx("span",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.05rem",fontWeight:700,color:"var(--saffron-dark)"},children:h.dayCostEstimate})]})]}),s.length>1&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:20},children:[e.jsx("button",{onClick:()=>n(g=>Math.max(0,g-1)),disabled:l===0,style:{padding:"10px 20px",borderRadius:12,border:"1.5px solid #E5E7EB",background:"white",fontFamily:"Outfit",fontSize:"0.85rem",fontWeight:600,color:l===0?"#D1D5DB":"var(--ink)",cursor:l===0?"not-allowed":"pointer"},children:"← Previous Day"}),e.jsx("button",{onClick:()=>n(g=>Math.min(s.length-1,g+1)),disabled:l===s.length-1,style:{padding:"10px 20px",borderRadius:12,border:"1.5px solid #E5E7EB",background:"white",fontFamily:"Outfit",fontSize:"0.85rem",fontWeight:600,color:l===s.length-1?"#D1D5DB":"var(--ink)",cursor:l===s.length-1?"not-allowed":"pointer"},children:"Next Day →"})]})]}),d==="hotels"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[(()=>{const g=new Map;s.forEach(p=>{p.stay&&g.set(p.stay.name,p.stay)});const u=[...g.values()];return u.length===0?e.jsx("div",{style:{textAlign:"center",padding:"60px 0",color:"#9CA3AF",fontFamily:"Outfit"},children:"No hotel suggestions in this itinerary."}):u.map((p,o)=>{const r=(i.budget||"mid-range").toLowerCase(),t=_e[r]||_e["mid-range"];return e.jsxs("div",{style:{background:"white",borderRadius:16,border:"1px solid #E5E7EB",padding:"20px 22px",boxShadow:"0 2px 10px rgba(0,0,0,0.04)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:12},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.2rem",fontWeight:700,color:"var(--ink)",marginBottom:4},children:p.name}),e.jsxs("div",{style:{fontSize:"0.78rem",color:"#9CA3AF",display:"flex",alignItems:"center",gap:4},children:[e.jsx(ge,{}),i.destination]})]}),e.jsx("div",{style:{textAlign:"right",flexShrink:0},children:e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.25rem",fontWeight:700,color:"var(--saffron-dark)"},children:p.cost})})]}),e.jsx("span",{style:{display:"inline-block",background:t.bg,color:t.color,fontSize:"0.7rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",padding:"3px 10px",borderRadius:6},children:p.type})]},o)})})(),i.localTransport&&e.jsxs("div",{style:{background:"#EFF6FF",borderRadius:16,padding:"18px 20px",display:"flex",gap:12,alignItems:"flex-start"},children:[e.jsx(we,{style:{color:"#2563EB",flexShrink:0,marginTop:3}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#2563EB",marginBottom:6},children:"Local Transport"}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#1E3A5F",lineHeight:1.55},children:i.localTransport})]})]})]}),d==="budget"&&e.jsxs("div",{children:[i.totalCostEstimate&&e.jsx("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28},children:e.jsxs("div",{style:{gridColumn:"1/-1",background:"linear-gradient(135deg, var(--saffron), var(--saffron-dark))",borderRadius:16,padding:"20px",textAlign:"center",color:"white"},children:[e.jsx("div",{style:{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",opacity:.8,marginBottom:6},children:"Total Trip Cost Estimate"}),e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.8rem",fontWeight:700,lineHeight:1},children:i.totalCostEstimate}),e.jsxs("div",{style:{fontSize:"0.75rem",opacity:.75,marginTop:4},children:["for ",i.travelers||1," traveler",i.travelers>1?"s":""]})]})}),e.jsxs("div",{style:{background:"white",borderRadius:16,border:"1px solid #E5E7EB",padding:"20px 22px",marginBottom:24,boxShadow:"0 2px 10px rgba(0,0,0,0.04)"},children:[e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9CA3AF",marginBottom:16},children:"Day-by-Day Cost Estimate (per person)"}),s.map((g,u)=>g.dayCostEstimate&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:u<s.length-1?"1px solid #F9FAFB":"none"},children:[e.jsxs("span",{style:{fontFamily:"Outfit",fontSize:"0.88rem",color:"#6B7280"},children:["Day ",g.day," — ",g.title]}),e.jsx("span",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.05rem",fontWeight:700,color:"var(--ink)"},children:g.dayCostEstimate})]},u))]}),e.jsxs("div",{style:{background:"white",borderRadius:16,border:"1px solid #E5E7EB",padding:"20px 22px",marginBottom:24,boxShadow:"0 2px 10px rgba(0,0,0,0.04)"},children:[e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9CA3AF",marginBottom:16},children:"Activity Costs"}),s.flatMap(g=>g.activities||[]).map((g,u)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #F9FAFB",fontSize:"0.85rem"},children:[e.jsx("span",{style:{color:"#374151"},children:g.name}),e.jsx("span",{style:{color:"#16A34A",fontWeight:600},children:g.cost})]},u))]})]}),d==="tips"&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[(i.tips||[]).length>0?e.jsxs("div",{style:{background:"white",borderRadius:16,border:"1px solid #E5E7EB",padding:"20px 22px",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"},children:[e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#9CA3AF",marginBottom:16},children:"🌟 Insider Tips"}),i.tips.map((g,u)=>e.jsxs("div",{style:{display:"flex",gap:12,padding:"10px 0",borderBottom:u<i.tips.length-1?"1px solid #F3F4F6":"none",fontSize:"0.88rem",color:"#374151",lineHeight:1.6,alignItems:"flex-start"},children:[e.jsx("span",{style:{color:"var(--saffron)",fontWeight:700,flexShrink:0,marginTop:2},children:"✦"}),g]},u))]}):e.jsx("div",{style:{textAlign:"center",padding:"60px 0",color:"#9CA3AF"},children:"No tips available."}),i.localTransport&&e.jsxs("div",{style:{background:"#EFF6FF",borderRadius:16,padding:"20px 22px"},children:[e.jsxs("div",{style:{fontFamily:"Outfit",fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"#2563EB",marginBottom:10,display:"flex",alignItems:"center",gap:8},children:[e.jsx(we,{})," Getting Around"]}),e.jsx("div",{style:{fontSize:"0.85rem",color:"#1E3A5F",lineHeight:1.6},children:i.localTransport})]})]}),e.jsxs("div",{style:{marginTop:40,display:"flex",flexDirection:"column",gap:12},children:[e.jsx("button",{onClick:c,className:"plan-again-btn",children:"✨ Plan Another Trip"}),e.jsx("button",{onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),style:{width:"100%",padding:"13px",background:"white",border:"1.5px solid #E5E7EB",borderRadius:14,fontFamily:"Outfit",fontWeight:600,fontSize:"0.9rem",color:"#374151",cursor:"pointer"},children:"↑ Back to Top"})]})]})}y.lazy(()=>Ke(()=>import("./Domestic-CdIuBT3Z.js"),__vite__mapDeps([0,1,2])));y.lazy(()=>Ke(()=>import("./International-DFXJ3y3d.js"),__vite__mapDeps([3,1,2])));const Gt="https://my-travel-app-backend-6.onrender.com",fe=new Map,qt=a=>{if(!a)return"/placeholder.jpg";const c=typeof a=="string"?a:a?.url||a?.src||a?.images||String(a);if(!c||c==="undefined"||c==="null")return"/placeholder.jpg";if(fe.has(c))return fe.get(c);const d=c.startsWith("http")?c:`${Gt}/${c.replace(/^\/+/,"")}`;return fe.set(c,d),d};function ue(a,c="300px"){const[d,m]=y.useState(!1);return y.useEffect(()=>{if(!a.current)return;const l=new IntersectionObserver(([n])=>{n.isIntersecting&&(m(!0),l.disconnect())},{rootMargin:c});return l.observe(a.current),()=>l.disconnect()},[a,c]),d}function Yt(a=.15){const c=y.useRef(null),[d,m]=y.useState(!1);return y.useEffect(()=>{if(!c.current)return;const l=new IntersectionObserver(([n])=>{n.isIntersecting&&(m(!0),l.disconnect())},{threshold:a,rootMargin:"0px 0px -60px 0px"});return l.observe(c.current),()=>l.disconnect()},[a]),[c,d]}const z=({as:a="div",delay:c=0,className:d="",style:m={},children:l,...n})=>{const[i,s]=Yt(),h=a;return e.jsx(h,{ref:i,className:`reveal ${s?"reveal-visible":""} ${d}`,style:{...m,transitionDelay:`${c}ms`},...n,children:l})},$t=()=>e.jsx("style",{children:`
    /* FIX 4: Font import moved to index.html <head> for parallel loading.
       This inline import is kept as fallback only. */
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

    :root {
      --saffron: #E8813A;
      --saffron-light: #F4A261;
      --saffron-dark: #C85A1A;
      --forest: #1A3C34;
      --forest-mid: #264D42;
      --forest-light: #2E6B5C;
      --cream: #FBF5EC;
      --cream-deep: #F3E8D4;
      --sand: #D4B896;
      --charcoal: #1C1C1E;
      --ink: #0F1923;
      --muted: #9CA3AF;
      --mist: rgba(251,245,236,0.06);
      --glass: rgba(255,255,255,0.08);
      --glass-border: rgba(255,255,255,0.12);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Outfit', sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }
    h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; }

    ::selection { background: var(--saffron); color: white; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream-deep); }
    ::-webkit-scrollbar-thumb { background: var(--saffron); border-radius: 3px; }

    .dvd-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      transition: all 0.4s cubic-bezier(.4,0,.2,1);
    }
    .dvd-nav.scrolled {
      background: rgba(15,25,35,0.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .nav-link {
      color: rgba(255,255,255,0.8); text-decoration: none;
      font-size: 0.85rem; font-weight: 500; letter-spacing: 0.5px;
      padding: 6px 0; position: relative; transition: color 0.3s;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 1.5px; background: var(--saffron);
      transition: width 0.3s ease;
    }
    .nav-link:hover { color: white; }
    .nav-link:hover::after { width: 100%; }

    .hero-container { height: 100vh; min-height: 680px; position: relative; overflow: hidden; }
    .hero-slide { position: absolute; inset: 0; transition: opacity 0.9s ease, transform 0.9s ease; }
    .hero-slide.active { opacity: 1; transform: scale(1); z-index: 2; }
    .hero-slide.inactive { opacity: 0; transform: scale(1.04); z-index: 1; }
    .hero-img { width: 100%; height: 100%; object-fit: cover; }
    .hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(105deg, rgba(15,25,35,0.82) 0%, rgba(15,25,35,0.45) 55%, rgba(15,25,35,0.1) 100%);
    }
    .hero-content { position: relative; z-index: 3; }

    .dest-card {
      background: white; border-radius: 20px; overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      transition: transform 0.4s cubic-bezier(.25,.8,.25,1), box-shadow 0.4s;
      cursor: pointer;
    }
    .dest-card:hover { transform: translateY(-10px); box-shadow: 0 20px 60px rgba(0,0,0,0.14); }
    .dest-card-img { position: relative; overflow: hidden; }
    .dest-card-img img { transition: transform 0.6s ease; }
    .dest-card:hover .dest-card-img img { transform: scale(1.08); }

    .glass-card {
      background: var(--glass);
      backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
      color: white; border: none; border-radius: 50px;
      font-family: 'Outfit', sans-serif; font-weight: 600;
      cursor: pointer; transition: all 0.3s;
      box-shadow: 0 4px 20px rgba(232,129,58,0.35);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(232,129,58,0.5);
    }
    .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
    .btn-outline {
      background: transparent; color: white;
      border: 1.5px solid rgba(255,255,255,0.4);
      border-radius: 50px; font-family: 'Outfit', sans-serif;
      font-weight: 500; cursor: pointer; transition: all 0.3s;
    }
    .btn-outline:hover { background: rgba(255,255,255,0.12); border-color: white; }

    .search-container {
      background: white; border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      padding: 8px;
    }
    .search-tab {
      border-radius: 12px; padding: 10px 20px;
      font-family: 'Outfit', sans-serif; font-size: 0.85rem;
      font-weight: 500; cursor: pointer; transition: all 0.2s;
      border: none; background: transparent; color: #6b7280;
    }
    .search-tab.active { background: var(--forest); color: white; }
    .search-input {
      border: none; outline: none; font-family: 'Outfit', sans-serif;
      font-size: 0.95rem; background: transparent; width: 100%; color: var(--ink);
    }
    .search-input::placeholder { color: #9ca3af; }

    .filter-pill {
      padding: 8px 20px; border-radius: 50px;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem;
      font-weight: 600; cursor: pointer; transition: all 0.25s;
      border: 1.5px solid #E5E7EB; background: white; color: #6B7280;
      white-space: nowrap;
    }
    .filter-pill:hover { border-color: var(--saffron); color: var(--saffron); }
    .filter-pill.active {
      background: var(--saffron); color: white;
      border-color: var(--saffron);
      box-shadow: 0 4px 14px rgba(232,129,58,0.35);
    }

    .section-eyebrow {
      font-family: 'Outfit', sans-serif;
      font-size: 0.75rem; font-weight: 700;
      letter-spacing: 3px; text-transform: uppercase;
      color: var(--saffron);
    }
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 600; line-height: 1.15; color: var(--ink);
    }

    .stat-ticker { border-left: 3px solid var(--saffron); padding-left: 16px; }

    .wishlist-drawer {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: 360px; background: white; z-index: 2000;
      box-shadow: -20px 0 60px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(.4,0,.2,1);
      overflow-y: auto;
    }
    .wishlist-drawer.open { transform: translateX(0); }
    .wishlist-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      z-index: 1999; opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    .wishlist-overlay.open { opacity: 1; pointer-events: all; }

    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(15,25,35,0.75);
      backdrop-filter: blur(8px);
      z-index: 3000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
    }
    .modal-box {
      background: white; border-radius: 24px;
      max-width: 620px; width: 100%;
      max-height: 88vh; overflow-y: auto;
      box-shadow: 0 40px 100px rgba(0,0,0,0.3);
      padding: 32px;
    }

    .progress { display: flex; gap: 8px; margin-bottom: 28px; }
    .progress-seg { flex: 1; height: 4px; border-radius: 2px; background: #E5E7EB; transition: background 0.3s; }
    .progress-seg.done { background: var(--saffron); }
    .step-enter { animation: fadeUp 0.4s ease forwards; }
    .field-label { font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .field-hint { font-weight: 400; color: var(--muted); font-size: 0.75rem; }
    .input { width: 100%; padding: 11px 16px; border-radius: 12px; border: 1.5px solid #E5E7EB; font-family: 'Outfit', sans-serif; font-size: 0.9rem; outline: none; transition: border-color 0.2s; }
    .input:focus { border-color: var(--saffron); }
    .weather-card { background: linear-gradient(135deg, var(--forest), var(--forest-light)); border-radius: 20px; padding: 24px; color: white; position: relative; overflow: hidden; }
    .weather-card::before { content: ''; position: absolute; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%; top: -60px; right: -60px; }
    .currency-card { background: linear-gradient(135deg, var(--saffron), var(--saffron-dark)); border-radius: 20px; padding: 24px; color: white; }
    .fab-wishlist {
      position: fixed; bottom: 30px; right: 30px; z-index: 900;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
      color: white; border: none; cursor: pointer;
      box-shadow: 0 8px 24px rgba(232,129,58,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem; transition: all 0.3s;
    }
    .fab-wishlist:hover { transform: scale(1.1); }
    .fab-badge {
      position: absolute; top: -4px; right: -4px;
      width: 20px; height: 20px; border-radius: 50%;
      background: var(--forest); color: white;
      font-size: 0.7rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid white;
    }

    .itinerary-overlay { position: fixed; inset: 0; background: var(--cream); z-index: 4000; overflow-y: auto; animation: fadeIn 0.4s ease forwards; }
    .itinerary-overlay-inner { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }
    .itinerary-topbar { position: sticky; top: 0; background: rgba(251,245,236,0.95); backdrop-filter: blur(12px); padding: 16px 0; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--cream-deep); z-index: 10; margin-bottom: 32px; }
    .itinerary-topbar-back { display: flex; align-items: center; gap: 8px; background: none; border: 1.5px solid #E5E7EB; border-radius: 10px; padding: 8px 16px; font-family: 'Outfit'; font-size: 0.85rem; font-weight: 600; cursor: pointer; color: var(--ink); transition: all 0.2s; }
    .itinerary-topbar-back:hover { border-color: var(--saffron); color: var(--saffron); }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes slideLeft { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

    .animate-fadeup { animation: fadeUp 0.7s ease forwards; }
    .animate-fadein { animation: fadeIn 0.5s ease forwards; }
    .spinner { animation: spin 0.8s linear infinite; }
    .animate-pulse { animation: pulse 2s ease-in-out infinite; }
    .animate-slideLeft { animation: slideLeft 0.5s ease forwards; }

    .stagger-1 { animation-delay: 0.1s; opacity: 0; }
    .stagger-2 { animation-delay: 0.2s; opacity: 0; }
    .stagger-3 { animation-delay: 0.3s; opacity: 0; }
    .stagger-4 { animation-delay: 0.4s; opacity: 0; }
    .stagger-5 { animation-delay: 0.5s; opacity: 0; }

    /* ─── New: Generic scroll-reveal animation ──────────────── */
    .reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.7s cubic-bezier(.25,.8,.25,1), transform 0.7s cubic-bezier(.25,.8,.25,1);
      will-change: opacity, transform;
    }
    .reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 12px;
    }

    .tag-badge { font-family: 'Outfit', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }
    .price-strike { text-decoration: line-through; color: #9CA3AF; }
    .star-gold { color: #F59E0B; }
    .react-multi-carousel-dot--active button { background: var(--saffron) !important; }
    .react-multi-carousel-dot button { background: #D1D5DB !important; border: none !important; width: 8px !important; height: 8px !important; }

    /* ─── New: "Make Your Tour Memorable" intro section ─────── */
    .intro-section {
      max-width: 1400px; margin: 0 auto; padding: 90px 24px;
      display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: center;
    }
    .intro-img-wrap {
      position: relative; border-radius: 24px; overflow: hidden;
      box-shadow: 0 30px 80px rgba(15,25,35,0.18);
    }
    .intro-img-wrap img { width: 100%; height: 420px; object-fit: cover; display: block; }
    .intro-stats {
      display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 40px;
    }
    .intro-stat-num {
      font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700;
      color: var(--saffron);
    }
    .intro-stat-label {
      font-family: 'Outfit', sans-serif; font-size: 0.8rem; color: var(--muted); margin-top: 4px;
    }

    /* ─── New: Best Place Destination grid ──────────────────── */
    .bpd-section { max-width: 1400px; margin: 0 auto; padding: 30px 24px 90px; }
    .bpd-grid {
      display: grid; grid-template-columns: repeat(4,1fr); gap: 24px;
    }
    .bpd-card {
      position: relative; border-radius: 20px; overflow: hidden; height: 260px;
      cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      transition: transform 0.4s cubic-bezier(.25,.8,.25,1), box-shadow 0.4s;
    }
    .bpd-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.16); }
    .bpd-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
    .bpd-card:hover img { transform: scale(1.08); }
    .bpd-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(15,25,35,0.75) 0%, rgba(15,25,35,0.05) 55%, rgba(15,25,35,0.35) 100%);
    }
    .bpd-name {
      position: absolute; top: 16px; left: 18px;
      font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 700; color: white;
    }
    .bpd-tours {
      position: absolute; bottom: 16px; right: 16px;
      background: var(--saffron); color: white; font-family: 'Outfit', sans-serif;
      font-size: 0.72rem; font-weight: 700; padding: 5px 12px; border-radius: 50px;
    }

    /* ─── New: Tour Destination grid (6 cards) ──────────────── */
    .td-section { max-width: 1400px; margin: 0 auto; padding: 30px 24px 90px; }
    .td-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
    .td-card-img-wrap { height: 230px; position: relative; }
    .td-price-tag {
      position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 50%);
      background: var(--saffron); color: white; font-family: 'Outfit', sans-serif;
      font-size: 0.95rem; font-weight: 700; padding: 10px 24px; border-radius: 50px;
      box-shadow: 0 4px 18px rgba(232,129,58,0.45); white-space: nowrap;
      z-index: 2;
    }
    .td-meta-row {
      display: flex; align-items: center; gap: 14px; font-family: 'Outfit', sans-serif;
      font-size: 0.78rem; color: var(--muted); margin-top: 10px; flex-wrap: wrap;
    }
    .td-meta-row span { display: flex; align-items: center; gap: 5px; }
    .td-location-row {
      display: flex; align-items: center; gap: 6px; font-family: 'Outfit', sans-serif;
      font-size: 0.8rem; color: #6B7280; margin-top: 6px;
    }
    .dest-card { padding-top: 4px; }
    .dest-card .td-card-img-wrap { overflow: visible; }
    .dest-card .td-card-img-wrap > img { border-radius: 20px 20px 0 0; }
    .dest-card .dest-card-img { overflow: visible; }

    /* ─── New: Tourist Feedback Section ─────────────────────── */
    .feedback-section {
      position: relative; padding: 100px 24px; overflow: hidden;
      background-color: #F1F2F4;
      background-image: url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1920&auto=format&fit=crop');
      background-size: cover; background-position: center bottom; background-repeat: no-repeat;
    }
    .feedback-section::before {
      content: ''; position: absolute; inset: 0;
      background: rgba(241,242,244,0.86);
    }
    .feedback-inner { position: relative; max-width: 1400px; margin: 0 auto; z-index: 1; }
    .feedback-scroll {
      display: flex; gap: 28px; margin-top: 56px;
      overflow-x: auto; scroll-behavior: smooth;
      padding-bottom: 8px; scrollbar-width: none;
    }
    .feedback-scroll::-webkit-scrollbar { display: none; }
    .feedback-card {
      background: white; border-radius: 16px; padding: 32px;
      box-shadow: 0 10px 40px rgba(15,25,35,0.06);
      flex: 0 0 calc((100% - 56px) / 3); min-width: 280px;
    }
    .feedback-text {
      font-family: 'Outfit', sans-serif; font-size: 0.95rem; color: #6B7280;
      line-height: 1.75; margin-bottom: 28px; min-height: 130px;
    }
    .feedback-person { display: flex; align-items: center; gap: 16px; }
    .feedback-avatar {
      width: 56px; height: 56px; border-radius: 50%; object-fit: cover; flex-shrink: 0;
    }
    .feedback-name {
      font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700; color: var(--ink);
    }
    .feedback-role {
      font-family: 'Outfit', sans-serif; font-size: 0.8rem; color: #B0B5BD; margin-top: 2px;
    }
    .feedback-dots { display: flex; justify-content: center; gap: 8px; margin-top: 48px; }
    .feedback-dot {
      width: 9px; height: 9px; border-radius: 50%; border: none; cursor: pointer; padding: 0;
      background: #D1D5DB; transition: background 0.3s;
    }
    .feedback-dot.active { background: var(--saffron); }

    @media(max-width:1024px) {
      .intro-section { grid-template-columns: 1fr; gap: 40px; }
      .bpd-grid { grid-template-columns: repeat(2,1fr); }
      .td-grid { grid-template-columns: repeat(2,1fr); }
      .feedback-card { flex: 0 0 calc((100% - 28px) / 2); }
    }
    @media(max-width:640px) {
      .bpd-grid { grid-template-columns: 1fr 1fr; }
      .td-grid { grid-template-columns: 1fr; }
      .intro-stats { grid-template-columns: repeat(3,1fr); gap: 12px; }
      .intro-stat-num { font-size: 1.6rem; }
      .feedback-card { flex: 0 0 85%; }
    }

    @media(max-width:768px) {
      .hide-mobile { display: none !important; }
      .wishlist-drawer { width: 100%; }
    }
    @media(min-width:769px) {
      .hide-desktop { display: none !important; }
    }
  `}),Ut=()=>e.jsxs("div",{style:{borderRadius:20,overflow:"hidden",background:"white",boxShadow:"0 4px 20px rgba(0,0,0,0.06)"},children:[e.jsx("div",{className:"skeleton",style:{height:200}}),e.jsxs("div",{style:{padding:16},children:[e.jsx("div",{className:"skeleton",style:{height:20,marginBottom:10}}),e.jsx("div",{className:"skeleton",style:{height:14,width:"60%",marginBottom:16}}),e.jsx("div",{className:"skeleton",style:{height:36,borderRadius:50}})]})]}),Ht=()=>e.jsx("div",{style:{maxWidth:1400,margin:"0 auto",padding:"60px 24px"},children:e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24},children:[1,2,3,4,5,6].map(a=>e.jsx(Ut,{},a))})}),Xt=D.memo(({onBookNow:a,onSearch:c})=>{const[d,m]=y.useState(0),[l,n]=y.useState(""),[i,s]=y.useState("destination"),h=y.useMemo(()=>[{img:"https://img.magnific.com/premium-photo/aerial-view-putra-mosque-with-putrajaya-city-centre-with-lake-sunset-putrajaya-malaysia_29505-1020.jpg?semt=ais_hybrid&w=740&q=80",tag:"International",title:`Discover
Malaysia`,sub:"Rainforests, Towers & Timeless Culture",cta:"View Packages"},{img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL3HTEZllU3Bj7_w_Ud7__3ey4KhpMdR4aog&s",tag:"North East",title:`Enchanting
Assam`,sub:"Tea Gardens, Wildlife & Brahmaputra Sunsets",cta:"Explore Now"},{img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUTwbPnL0BhEJTcyfY9qoVCuhPTEsl-VzT5YJruWvqP4KA2SvxfOUG-jNt&s=10",tag:"International",title:`Golden
Dubai`,sub:"Desert Dunes, Skylines & Arabian Nights",cta:"Book Trip"},{img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsYnp5Q1REhLvebW-nWF5p1uph1w4znd2y5NSw6aUkL92ycifpM5pER4wB&s=10",tag:"Scenic India",title:`Sacred
Himalayas`,sub:"Monasteries, Peaks & Spiritual Journeys",cta:"Explore"}],[]);y.useEffect(()=>{const u=setInterval(()=>m(p=>(p+1)%h.length),5500);return()=>clearInterval(u)},[h.length]);const g=y.useCallback(u=>{u.preventDefault(),c(l)},[c,l]);return e.jsxs("div",{className:"hero-container",children:[h.map((u,p)=>e.jsxs("div",{className:`hero-slide ${p===d?"active":"inactive"}`,children:[e.jsx("img",{src:u.img,alt:u.tag,className:"hero-img",loading:p===0?"eager":"lazy",fetchPriority:p===0?"high":"low"}),e.jsx("div",{className:"hero-overlay"})]},p)),e.jsx("div",{className:"hero-content",style:{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"center",paddingTop:72},children:e.jsxs("div",{style:{maxWidth:1400,margin:"0 auto",padding:"0 24px",width:"100%"},children:[e.jsx("div",{className:"animate-fadeup stagger-1",style:{marginBottom:16},children:e.jsx("span",{className:"tag-badge",style:{background:"var(--saffron)",color:"white"},children:h[d].tag})},`tag-${d}`),e.jsx("h1",{className:"animate-fadeup stagger-2",style:{fontFamily:"Cormorant Garamond, serif",fontSize:"clamp(3rem,8vw,6.5rem)",fontWeight:700,color:"white",lineHeight:1.05,marginBottom:16,whiteSpace:"pre-line",maxWidth:700},children:h[d].title},`title-${d}`),e.jsx("p",{className:"animate-fadeup stagger-3",style:{fontFamily:"Outfit, sans-serif",fontSize:"clamp(0.95rem,2vw,1.15rem)",color:"rgba(255,255,255,0.75)",marginBottom:40,fontWeight:300,maxWidth:460},children:h[d].sub},`sub-${d}`),e.jsx("div",{className:"animate-fadeup stagger-4",style:{maxWidth:640},children:e.jsxs("div",{className:"search-container",children:[e.jsx("div",{style:{display:"flex",gap:4,marginBottom:8},children:["destination","package","date"].map(u=>e.jsx("button",{className:`search-tab ${i===u?"active":""}`,onClick:()=>s(u),style:{textTransform:"capitalize"},children:u},u))}),e.jsxs("form",{onSubmit:g,style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsxs("div",{style:{flex:1,display:"flex",alignItems:"center",gap:10,padding:"4px 16px",borderRadius:12,border:"1.5px solid #E5E7EB"},children:[e.jsx(mt,{style:{color:"#9CA3AF",flexShrink:0}}),e.jsx("input",{className:"search-input",placeholder:i==="destination"?"Where do you want to go?":i==="package"?"Search tour packages...":"Pick a travel date...",value:l,onChange:u=>n(u.target.value)})]}),e.jsx("button",{type:"submit",className:"btn-primary",style:{padding:"14px 28px",fontSize:"0.9rem",borderRadius:12,flexShrink:0},children:"Search"})]})]})},`search-${d}`),e.jsxs("div",{className:"animate-fadeup stagger-5",style:{display:"flex",gap:14,marginTop:24},children:[e.jsxs("button",{onClick:a,className:"btn-primary",style:{padding:"13px 32px",fontSize:"0.9rem"},children:[h[d].cta," ",e.jsx(He,{style:{marginLeft:6,display:"inline"}})]}),e.jsx("a",{href:"#destinations",className:"btn-outline",style:{padding:"13px 28px",fontSize:"0.9rem",textDecoration:"none",display:"inline-flex",alignItems:"center"},children:"Browse All"})]},`cta-${d}`)]})}),e.jsx("div",{style:{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,zIndex:4},children:h.map((u,p)=>e.jsx("button",{onClick:()=>m(p),style:{width:p===d?32:8,height:8,borderRadius:4,border:"none",background:p===d?"var(--saffron)":"rgba(255,255,255,0.4)",cursor:"pointer",transition:"all 0.3s",padding:0}},p))}),e.jsx("button",{onClick:()=>m(u=>(u-1+h.length)%h.length),style:{position:"absolute",left:20,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",color:"white",fontSize:"1.2rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:4},children:"‹"}),e.jsx("button",{onClick:()=>m(u=>(u+1)%h.length),style:{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",color:"white",fontSize:"1.2rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:4},children:"›"})]})}),Kt=D.memo(()=>e.jsx("div",{style:{background:"var(--forest)",padding:"28px 24px"},children:e.jsx("div",{style:{maxWidth:1400,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20},children:[{val:"36+",label:"Years Experience",icon:e.jsx(ft,{})},{val:"5k+",label:"Happy Travellers",icon:e.jsx(xe,{})},{val:"200+",label:"Tour Packages",icon:e.jsx(ut,{})},{val:"4.9★",label:"Average Rating",icon:e.jsx(gt,{})}].map((a,c)=>e.jsxs("div",{className:"stat-ticker",style:{borderColor:"var(--saffron)"},children:[e.jsx("div",{style:{color:"var(--saffron)",marginBottom:4,fontSize:"0.9rem"},children:a.icon}),e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"2rem",fontWeight:700,color:"white",lineHeight:1},children:a.val}),e.jsx("div",{style:{fontFamily:"Outfit, sans-serif",fontSize:"0.75rem",color:"rgba(255,255,255,0.55)",marginTop:4,letterSpacing:.5},children:a.label})]},c))})})),Qt=D.memo(()=>{const[a,c]=y.useState(""),[d,m]=y.useState(null),[l,n]=y.useState("USD"),i=y.useMemo(()=>({USD:.012,EUR:.011,GBP:.0094,AED:.044,SGD:.016,JPY:1.79}),[]),s=y.useMemo(()=>[{city:"Mumbai",temp:32,icon:e.jsx(je,{}),desc:"Sunny"},{city:"Delhi",temp:28,icon:e.jsx(xt,{}),desc:"Windy"},{city:"Goa",temp:34,icon:e.jsx(je,{}),desc:"Clear"}],[]),[h,g]=y.useState(0);y.useEffect(()=>{const p=setInterval(()=>g(o=>(o+1)%s.length),3e3);return()=>clearInterval(p)},[s.length]);const u=y.useCallback(()=>{a&&m((parseFloat(a)*i[l]).toFixed(2))},[a,i,l]);return e.jsxs("div",{style:{maxWidth:1400,margin:"0 auto",padding:"40px 24px 0"},children:[e.jsx(Ue,{}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20},children:[e.jsxs("div",{className:"weather-card",children:[e.jsx("div",{style:{fontSize:"0.75rem",fontFamily:"Outfit",letterSpacing:2,textTransform:"uppercase",opacity:.7,marginBottom:12},children:"Travel Weather"}),e.jsxs("div",{className:"animate-slideLeft",style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"2.5rem",fontWeight:700,lineHeight:1},children:[s[h].temp,"°C"]}),e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"1rem",fontWeight:600,marginTop:4},children:s[h].city}),e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.8rem",opacity:.7},children:s[h].desc})]}),e.jsx("div",{style:{fontSize:"3.5rem",opacity:.9},children:s[h].icon})]},h),e.jsx("div",{style:{display:"flex",gap:8,marginTop:16},children:s.map((p,o)=>e.jsx("button",{onClick:()=>g(o),style:{width:o===h?24:8,height:8,borderRadius:4,border:"none",background:o===h?"var(--saffron)":"rgba(255,255,255,0.3)",cursor:"pointer",transition:"all 0.3s",padding:0}},o))})]}),e.jsxs("div",{className:"currency-card",children:[e.jsx("div",{style:{fontSize:"0.75rem",fontFamily:"Outfit",letterSpacing:2,textTransform:"uppercase",opacity:.85,marginBottom:12},children:"Currency Converter"}),e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:12},children:[e.jsxs("div",{style:{flex:1,display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"8px 12px"},children:[e.jsx(ye,{style:{flexShrink:0}}),e.jsx("input",{value:a,onChange:p=>c(p.target.value),placeholder:"Amount ₹",style:{background:"none",border:"none",outline:"none",color:"white",fontFamily:"Outfit",fontSize:"0.95rem",width:"100%"}})]}),e.jsx("select",{value:l,onChange:p=>n(p.target.value),style:{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,color:"white",padding:"8px 12px",fontFamily:"Outfit",cursor:"pointer",fontSize:"0.9rem"},children:Object.keys(i).map(p=>e.jsx("option",{value:p,style:{background:"var(--saffron-dark)",color:"white"},children:p},p))})]}),e.jsx("button",{onClick:u,style:{width:"100%",padding:"10px",background:"rgba(255,255,255,0.25)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:10,color:"white",fontFamily:"Outfit",fontWeight:600,cursor:"pointer",fontSize:"0.9rem"},children:"Convert"}),d&&e.jsxs("div",{style:{marginTop:12,fontFamily:"Cormorant Garamond, serif",fontSize:"1.8rem",fontWeight:700},children:[d," ",l]})]}),e.jsxs("div",{style:{background:"var(--ink)",borderRadius:20,padding:24,color:"white"},children:[e.jsx("div",{style:{fontSize:"0.75rem",fontFamily:"Outfit",letterSpacing:2,textTransform:"uppercase",color:"var(--saffron)",marginBottom:16},children:"Need Help?"}),e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.4rem",fontWeight:600,marginBottom:16},children:"Talk to Our Travel Experts"}),[{icon:e.jsx(Xe,{}),label:"+91 78882 51550"},{icon:e.jsx(ne,{}),label:"WhatsApp Us"},{icon:e.jsx(qe,{}),label:"info@desivdesi.com"}].map((p,o)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10,fontFamily:"Outfit",fontSize:"0.85rem",color:"rgba(255,255,255,0.75)"},children:[e.jsx("span",{style:{color:"var(--saffron)"},children:p.icon}),p.label]},o))]})]})]})}),Jt=D.memo(({onBookNow:a})=>e.jsxs("section",{className:"intro-section",children:[e.jsx(z,{className:"intro-img-wrap",children:e.jsx("img",{src:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/e2/f4/30/caption.jpg?w=1200&h=1200&s=1",alt:"Adventure tour",loading:"lazy",decoding:"async"})}),e.jsxs(z,{delay:150,children:[e.jsx("div",{className:"section-eyebrow",style:{marginBottom:12},children:"Why Choose Us"}),e.jsxs("h2",{className:"section-title",style:{marginBottom:18},children:["Make Your Tour ",e.jsx("em",{style:{color:"var(--saffron)"},children:"Memorable"})," and Safe With Us"]}),e.jsx("p",{style:{fontFamily:"Outfit",fontSize:"0.95rem",color:"#6B7280",lineHeight:1.8,maxWidth:520},children:"Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean."}),e.jsx("div",{className:"intro-stats",children:[{num:"300",label:"Successful Tours"},{num:"24,000",label:"Happy Tourist"},{num:"200",label:"Place Explored"}].map((c,d)=>e.jsxs("div",{children:[e.jsx("div",{className:"intro-stat-num",children:c.num}),e.jsx("div",{className:"intro-stat-label",children:c.label})]},d))}),e.jsxs("button",{onClick:a,className:"btn-primary",style:{marginTop:40,padding:"14px 34px",fontSize:"0.9rem"},children:["Plan Your Trip ",e.jsx(He,{style:{marginLeft:8,display:"inline"}})]})]})]})),Zt=D.memo(()=>{const a=y.useMemo(()=>[{name:"Singapore",img:"https://media.istockphoto.com/id/1767504971/photo/gatineau-hills-ottawa-canada-autumn-landscape.jpg?s=612x612&w=0&k=20&c=43KxWbUigZwDVwjaoZNYM69HMU1cM3_ArJuVePIB5tw=",tours:"8 Tours"},{name:"Canada",img:"https://media.istockphoto.com/id/471926619/photo/moraine-lake-at-sunrise-banff-national-park-canada.jpg?s=612x612&w=0&k=20&c=mujiCtVk5QA697SD3d8V8BGmd91-8HlxCNHkolEA0Bo=",tours:"2 Tours"},{name:"Thailand",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJPQob5A1Ha53coRBqaL4PviivzEIBrPnV2dtfVm5YgjL6RNwJQLMGrCE&s=10",tours:"5 Tours"},{name:"Australia",img:"https://media.istockphoto.com/id/504539120/photo/sydney-waterfront-at-night.jpg?s=612x612&w=0&k=20&c=sGo2c5ZNOeU43KLGc5DV8Qlsnqa1VJxLu0YwuQf7mGs=",tours:"5 Tours"}],[]);return e.jsxs("section",{className:"bpd-section",id:"destinations",children:[e.jsxs(z,{style:{textAlign:"center",marginBottom:48},children:[e.jsx("div",{className:"section-eyebrow",style:{marginBottom:10},children:"Top Picks"}),e.jsxs("h2",{className:"section-title",children:["Best Place ",e.jsx("em",{style:{color:"var(--saffron)"},children:"Destination"})]})]}),e.jsx("div",{className:"bpd-grid",children:a.map((c,d)=>e.jsxs(z,{delay:d*100,className:"bpd-card",children:[e.jsx("img",{src:c.img,alt:c.name,loading:"lazy",decoding:"async"}),e.jsx("div",{className:"bpd-overlay"}),e.jsx("div",{className:"bpd-name",children:c.name}),e.jsx("div",{className:"bpd-tours",children:c.tours})]},d))})]})}),ei=D.memo(()=>{const a=y.useMemo(()=>[{text:"Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",name:"Roger Scott",role:"Marketing Manager",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"},{text:"Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",name:"Roger Scott",role:"Marketing Manager",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"},{text:"Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",name:"Roger Scott",role:"Marketing Manager",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"},{text:"Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",name:"Roger Scott",role:"Marketing Manager",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"},{text:"Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",name:"Roger Scott",role:"Marketing Manager",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"},{text:"Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",name:"Roger Scott",role:"Marketing Manager",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"}],[]),[c,d]=y.useState(0),m=y.useRef(null);y.useEffect(()=>{const n=m.current;if(!n)return;const i=setInterval(()=>{const s=n.firstChild?n.firstChild.offsetWidth+28:300,h=n.scrollWidth-n.clientWidth;let g=n.scrollLeft+s;g>=h-5&&(g=0),n.scrollTo({left:g,behavior:"smooth"})},1500);return()=>clearInterval(i)},[a.length]),y.useEffect(()=>{const n=m.current;if(!n)return;const i=()=>{const s=n.firstChild?n.firstChild.offsetWidth+28:300,h=Math.round(n.scrollLeft/s);d(Math.min(h,a.length-1))};return n.addEventListener("scroll",i,{passive:!0}),()=>n.removeEventListener("scroll",i)},[a.length]);const l=y.useCallback(n=>{const i=m.current;if(!i)return;const s=i.firstChild?i.firstChild.offsetWidth+28:300;i.scrollTo({left:n*s,behavior:"smooth"})},[]);return e.jsx("section",{className:"feedback-section",children:e.jsxs("div",{className:"feedback-inner",children:[e.jsxs(z,{style:{textAlign:"center"},children:[e.jsx("div",{className:"section-eyebrow",style:{marginBottom:10},children:"What People Say"}),e.jsxs("h2",{className:"section-title",children:["Tourist ",e.jsx("em",{style:{color:"var(--saffron)"},children:"Feedback"})]})]}),e.jsx("div",{className:"feedback-scroll",ref:m,children:a.map((n,i)=>e.jsxs("div",{className:"feedback-card",children:[e.jsx("p",{className:"feedback-text",children:n.text}),e.jsxs("div",{className:"feedback-person",children:[e.jsx("img",{className:"feedback-avatar",src:n.avatar,alt:n.name,loading:"lazy",decoding:"async"}),e.jsxs("div",{children:[e.jsx("div",{className:"feedback-name",children:n.name}),e.jsx("div",{className:"feedback-role",children:n.role})]})]})]},i))}),e.jsx("div",{className:"feedback-dots",children:a.map((n,i)=>e.jsx("button",{className:`feedback-dot ${i===c?"active":""}`,onClick:()=>l(i)},i))})]})})}),ti=D.memo(({card:a,onFavourite:c,isFav:d,onBookNow:m,onRate:l,rating:n})=>e.jsxs("div",{className:"dest-card",children:[e.jsxs("div",{className:"dest-card-img td-card-img-wrap",children:[e.jsx("img",{src:a.img||"/placeholder.jpg",alt:a.title,loading:"lazy",decoding:"async",style:{width:"100%",height:"100%",objectFit:"cover"}}),e.jsx("div",{style:{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",borderRadius:"20px 20px 0 0"}}),e.jsx("button",{onClick:()=>c(a._id),style:{position:"absolute",top:12,right:12,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.2s"},children:e.jsx(se,{style:{color:d?"#E85757":"#D1D5DB",fontSize:"0.9rem"}})}),e.jsxs("span",{className:"td-price-tag",children:[a.price||"$300","/person"]})]}),e.jsxs("div",{style:{padding:"24px 20px 20px"},children:[e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.2rem",fontWeight:600,color:"var(--ink)",marginBottom:2},children:a.title}),e.jsxs("div",{className:"td-location-row",children:[e.jsx(ge,{style:{color:"var(--saffron)"}}),a.category||"Bali, Indonesia"]}),e.jsxs("div",{className:"td-meta-row",children:[e.jsxs("span",{children:[e.jsx(xe,{style:{color:"var(--saffron)"}})," ",a.people||2]}),e.jsxs("span",{children:[e.jsx(yt,{style:{color:"var(--saffron)"}})," ",a.days||3]}),e.jsxs("span",{children:[e.jsx(bt,{style:{color:"var(--saffron)"}})," ",a.terrain||"Near Mountain"]})]}),e.jsx("div",{style:{display:"flex",gap:3,margin:"14px 0 4px"},children:[1,2,3,4,5].map(i=>e.jsx("button",{onClick:()=>l(a._id,i),style:{background:"none",border:"none",cursor:"pointer",padding:0,fontSize:"1.1rem",color:i<=(n||0)?"#F59E0B":"#E5E7EB"},children:"★"},i))})]})]})),ii=D.memo(({open:a,onClose:c,wishlist:d,items:m})=>{const l=y.useMemo(()=>m.filter(n=>d.includes(n._id)),[m,d]);return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:`wishlist-overlay ${a?"open":""}`,onClick:c}),e.jsxs("div",{className:`wishlist-drawer ${a?"open":""}`,children:[e.jsxs("div",{style:{padding:"24px 24px 16px",borderBottom:"1px solid #F3F4F6",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.5rem",fontWeight:700,color:"var(--ink)"},children:"My Wishlist"}),e.jsxs("div",{style:{fontFamily:"Outfit",fontSize:"0.8rem",color:"#9CA3AF",marginTop:2},children:[l.length," destinations saved"]})]}),e.jsx("button",{onClick:c,style:{background:"none",border:"none",fontSize:"1.1rem",cursor:"pointer",color:"#6B7280",width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(wt,{})})]}),e.jsx("div",{style:{padding:16,overflowY:"auto"},children:l.length===0?e.jsxs("div",{style:{textAlign:"center",padding:"60px 24px"},children:[e.jsx(se,{style:{fontSize:"2.5rem",color:"#E5E7EB",marginBottom:16}}),e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.3rem",fontWeight:600,color:"#9CA3AF",marginBottom:8},children:"No Saved Trips Yet"}),e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.85rem",color:"#D1D5DB"},children:"Tap the heart icon on any destination to save it here."})]}):l.map((n,i)=>e.jsxs("div",{style:{display:"flex",gap:14,padding:"14px 0",borderBottom:"1px solid #F9FAFB"},children:[e.jsx("img",{src:qt(n.images||n.image||n.img),alt:n.title,loading:"lazy",decoding:"async",style:{width:70,height:70,borderRadius:12,objectFit:"cover",flexShrink:0}}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1rem",fontWeight:700,color:"var(--ink)",marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:n.title}),e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.75rem",color:"#9CA3AF",marginBottom:8},children:"India • 4.8 ★"}),e.jsx(M,{to:"/Maharashtra",style:{fontFamily:"Outfit",fontSize:"0.78rem",fontWeight:600,color:"var(--saffron)",textDecoration:"none"},children:"View Package →"})]})]},i))})]})]})}),ri=({itinerary:a,onPlanAgain:c})=>e.jsx("div",{className:"itinerary-overlay",children:e.jsxs("div",{className:"itinerary-overlay-inner",children:[e.jsxs("div",{className:"itinerary-topbar",children:[e.jsx("button",{className:"itinerary-topbar-back",onClick:c,children:"← Plan Another Trip"}),e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.1rem",fontWeight:700,color:"var(--ink)"},children:"Your AI Itinerary ✨"})]}),e.jsx(Vt,{itinerary:a,onPlanAgain:c})]})}),oi=D.memo(({onBookNow:a})=>{const[c,d]=y.useState(0),m=y.useMemo(()=>[{text:"The best travel experience I've ever had! Desi V Desi made every moment magical.",author:"Priya S.",role:"Solo Traveler",avatar:"P"},{text:"Perfectly planned trip, seamless booking. Our family had an absolutely wonderful time!",author:"Rajesh K.",role:"Family Trip",avatar:"R"},{text:"Excellent service and truly amazing tours. I've now booked three trips with them!",author:"Anjali M.",role:"Frequent Traveler",avatar:"A"},{text:"From the first booking to the last day — everything was seamless and beautiful.",author:"Sunil T.",role:"Honeymoon Package",avatar:"S"}],[]);return y.useEffect(()=>{const l=setInterval(()=>d(n=>(n+1)%m.length),4e3);return()=>clearInterval(l)},[m.length]),e.jsx("section",{id:"about",style:{background:"var(--ink)",padding:"96px 0",overflow:"hidden"},children:e.jsxs("div",{style:{maxWidth:1400,margin:"0 auto",padding:"0 24px"},children:[e.jsxs(z,{style:{textAlign:"center",marginBottom:64},children:[e.jsx("div",{className:"section-eyebrow",style:{marginBottom:12},children:"Our Story"}),e.jsxs("h2",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"clamp(2.2rem,5vw,4rem)",fontWeight:700,color:"white",lineHeight:1.1},children:["Welcome to ",e.jsx("em",{style:{color:"var(--saffron)"},children:"Desi V Desi"})," Tours"]}),e.jsx("p",{style:{fontFamily:"Outfit",fontSize:"0.95rem",color:"rgba(255,255,255,0.5)",marginTop:14,maxWidth:500,margin:"14px auto 0"},children:"36 years of crafting unforgettable journeys across India and the world."})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24},children:[e.jsxs(z,{delay:0,className:"glass-card",style:{padding:32},children:[e.jsxs("div",{style:{display:"flex",gap:18,marginBottom:24},children:[e.jsx("img",{src:"/photo2.jpg",alt:"Founder",loading:"lazy",decoding:"async",style:{width:72,height:72,borderRadius:16,objectFit:"cover",flexShrink:0,border:"2px solid var(--saffron)"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.1rem",fontWeight:700,color:"white"},children:"Mr. Sonwane"}),e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.75rem",color:"var(--saffron-light)",letterSpacing:1,textTransform:"uppercase",marginTop:4},children:"Founder & CEO"})]})]}),e.jsx("p",{style:{fontFamily:"Outfit",fontSize:"0.88rem",color:"rgba(255,255,255,0.65)",lineHeight:1.75,fontStyle:"italic"},children:'"We are one of the leading tour operators in Maharashtra for the last 36 years, known as experts in Domestic as well as International tours."'}),e.jsx("div",{style:{marginTop:24,display:"flex",gap:14},children:[e.jsx(vt,{}),e.jsx(Le,{}),e.jsx(Ve,{}),e.jsx(Ge,{})].map((l,n)=>e.jsx("a",{href:"#",style:{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.6)",textDecoration:"none",fontSize:"0.85rem"},children:l},n))})]}),e.jsxs(z,{delay:120,className:"glass-card",style:{padding:32,display:"flex",flexDirection:"column"},children:[e.jsx("div",{style:{color:"var(--saffron)",fontSize:"2.5rem",fontFamily:"Cormorant Garamond, serif",lineHeight:1,marginBottom:16},children:'"'}),e.jsxs("div",{className:"animate-fadeup",style:{flex:1},children:[e.jsx("p",{style:{fontFamily:"Outfit",fontSize:"0.92rem",color:"rgba(255,255,255,0.8)",lineHeight:1.75,fontStyle:"italic",marginBottom:20},children:m[c].text}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("div",{style:{width:40,height:40,borderRadius:"50%",background:"var(--saffron)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Cormorant Garamond, serif",fontSize:"1.1rem",fontWeight:700,color:"white"},children:m[c].avatar}),e.jsxs("div",{children:[e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.88rem",fontWeight:600,color:"white"},children:m[c].author}),e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.75rem",color:"var(--saffron-light)"},children:m[c].role})]})]})]},c),e.jsx("div",{style:{display:"flex",gap:6,marginTop:24},children:m.map((l,n)=>e.jsx("button",{onClick:()=>d(n),style:{width:n===c?24:8,height:8,borderRadius:4,border:"none",background:n===c?"var(--saffron)":"rgba(255,255,255,0.2)",cursor:"pointer",transition:"all 0.3s",padding:0}},n))})]}),e.jsxs(z,{delay:240,style:{background:"linear-gradient(135deg, var(--saffron), var(--saffron-dark))",borderRadius:20,padding:32,display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontFamily:"Outfit",fontSize:"0.75rem",color:"rgba(255,255,255,0.7)",letterSpacing:2,textTransform:"uppercase",marginBottom:16},children:"Plan Your Dream Trip"}),e.jsx("h3",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"2rem",fontWeight:700,color:"white",lineHeight:1.2,marginBottom:16},children:"Ready for Your Next Adventure?"}),e.jsx("p",{style:{fontFamily:"Outfit",fontSize:"0.88rem",color:"rgba(255,255,255,0.8)",lineHeight:1.6},children:"Join 15,000+ happy travellers who trust Desi V Desi for their dream vacations."})]}),e.jsxs("div",{style:{marginTop:32,display:"flex",flexDirection:"column",gap:10},children:[e.jsx("button",{onClick:a,style:{width:"100%",padding:"14px",background:"white",border:"none",borderRadius:14,fontFamily:"Outfit",fontWeight:700,fontSize:"0.9rem",color:"var(--saffron-dark)",cursor:"pointer"},children:"Book Your Tour Now →"}),e.jsxs("a",{href:"tel:+919876543210",style:{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"13px",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:14,fontFamily:"Outfit",fontWeight:500,fontSize:"0.85rem",color:"white",textDecoration:"none"},children:[e.jsx(Xe,{size:13})," Call Us Now"]})]})]})]})]})})});function ai(){const{user:a}=y.useContext(nt),[c,d]=y.useState(!1),[m,l]=y.useState(!1),[n,i]=y.useState(null),[s,h]=y.useState(!1),[g,u]=y.useState(!1),[p,o]=y.useState([]),[r,t]=y.useState({}),[f,x]=y.useState([]),[b,v]=y.useState({animation:[],states:[]}),[w,j]=y.useState([]),[S,k]=y.useState(!0),[F,C]=y.useState(!1),A=y.useRef(null),E=y.useRef(null),W=y.useRef(null),P=y.useRef(null),R=st(),K=y.useRef(!1);ue(E),ue(W),ue(P);const le=lt();y.useEffect(()=>{const I=()=>C(window.scrollY>400);return window.addEventListener("scroll",I,{passive:!0}),()=>window.removeEventListener("scroll",I)},[]),y.useEffect(()=>{const I=R.state;I&&(le(R.pathname,{replace:!0,state:{}}),I.scrollToAbout&&setTimeout(()=>A.current?.scrollIntoView({behavior:"smooth"}),300),I.scrollToDomestic&&setTimeout(()=>E.current?.scrollIntoView({behavior:"smooth"}),300),I.scrollToInternational&&setTimeout(()=>W.current?.scrollIntoView({behavior:"smooth"}),300))},[R]),y.useEffect(()=>{if(K.current)return;const I=new AbortController,B={signal:I.signal};return Promise.all([H.get("/favourites/getCards",B),H.get("/maharashtra-domestic/getallAnimation",B),H.get("/maharashtra-domestic/getstates",B),H.get("/International/getallInternational",B)]).then(([O,q,L,ve])=>{x(O.data||[]),v({animation:q.data||[],states:Array.isArray(L.data)?L.data:L.data?.data||[]}),j(Array.isArray(ve.data)?ve.data:[]),K.current=!0}).catch(O=>{O.name!=="AbortError"&&O.name!=="CanceledError"&&console.error(O)}).finally(()=>k(!1)),()=>I.abort()},[]);const _=y.useCallback(()=>{a?d(!0):(h(!0),setTimeout(()=>h(!1),3e3))},[a]),Q=y.useCallback(I=>{i(I),l(!1)},[]),J=y.useCallback(()=>{i(null),l(!0)},[]),de=y.useCallback(async I=>{if(!a){h(!0),setTimeout(()=>h(!1),3e3);return}try{const B=await H.put(`/favourites/${I}/toggle`,{},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}),{status:O}=B.data;o(q=>O==="like"?[...q,I]:q.filter(L=>L!==I))}catch(B){console.error(B)}},[a]);y.useMemo(()=>({desktop:{breakpoint:{max:3e3,min:1024},items:3,slidesToSlide:1},tablet:{breakpoint:{max:1024,min:640},items:2,slidesToSlide:1},mobile:{breakpoint:{max:640,min:0},items:1,slidesToSlide:1}}),[]);const Ze=y.useMemo(()=>[{_id:"static-1",title:"Bali, Indonesia",category:"Bali, Indonesia",img:"https://media.istockphoto.com/id/653953140/photo/hindu-temple-in-bali.jpg?s=612x612&w=0&k=20&c=ysj3S2kV1ZgCr4QZWDzjvHRowCI3-cR1xQNnqE8-BS4=",price:"$300",people:2,days:3,terrain:"Near Mountain"},{_id:"static-2",title:"Bali, Indonesia",category:"Bali, Indonesia",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJbBbZr-ySYTs-Xxg3_qhmHozjHNIwLNHVNbkf5-tdZA&s=10",price:"$300",people:2,days:3,terrain:"Near Beach"},{_id:"static-3",title:"Bali, Indonesia",category:"Bali, Indonesia",img:"https://www.indietraveller.co/wp-content/uploads/2025/06/Bali-swing-at-tegalalang-rice-terrace-in-Bali-Indonesia-1024x683.jpg",price:"$300",people:2,days:3,terrain:"Near Mountain"},{_id:"static-4",title:"Bali, Indonesia",category:"Bali, Indonesia",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwRyAwB50NWpst9amktR46lDJLXVIm5bDPTmDLQsG1lA&s=10",price:"$300",people:2,days:3,terrain:"Near Beach"},{_id:"static-5",title:"Bali, Indonesia",category:"Bali, Indonesia",img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw1t7dcZ7C52q-Z28XDICJxX2t2HsNeRnmApfauQGbzg&s=10",price:"$300",people:2,days:3,terrain:"Near Mountain"},{_id:"static-6",title:"Bali, Indonesia",category:"Bali, Indonesia",img:"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTmT7nVGNmtggrureiKCReLjpk4sLJfzhgvKfzT2IbAtmXG2lDn",price:"$300",people:2,days:3,terrain:"Near Beach"}],[]);return e.jsxs(e.Fragment,{children:[e.jsx(dt,{}),e.jsx(Ue,{}),e.jsx($t,{}),s&&e.jsxs("div",{className:"animate-fadeup",style:{position:"fixed",top:20,right:20,zIndex:9999,background:"white",borderRadius:16,padding:"14px 20px",boxShadow:"0 20px 60px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",gap:12,border:"1px solid #FDE68A"},children:[e.jsx("span",{style:{fontSize:"1.3rem"},children:"🔐"}),e.jsxs("p",{style:{fontFamily:"Outfit",fontSize:"0.88rem",color:"#374151"},children:["Please ",e.jsx(M,{to:"/login",style:{color:"var(--saffron)",fontWeight:700},children:"log in"})," to continue"]})]}),e.jsx(Xt,{onBookNow:_,onSearch:()=>{}}),e.jsx(Kt,{}),e.jsx(Qt,{}),e.jsx(Jt,{onBookNow:_}),e.jsx(Zt,{}),e.jsxs("section",{className:"td-section",children:[e.jsxs(z,{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:20},children:[e.jsxs("div",{style:{textAlign:"center",flex:"1 0 100%"},children:[e.jsx("div",{className:"section-eyebrow",style:{marginBottom:10},children:"Curated For You"}),e.jsxs("h2",{className:"section-title",children:["Tour ",e.jsx("em",{style:{color:"var(--saffron)"},children:"Destination"})]})]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",width:"100%"},children:e.jsxs("button",{onClick:()=>l(!0),className:"btn-primary",style:{padding:"12px 24px",fontSize:"0.85rem",display:"flex",alignItems:"center",gap:8},children:[e.jsx($e,{})," AI Trip Planner ✨"]})})]}),e.jsx("div",{className:"td-grid",children:Ze.map((I,B)=>e.jsx(z,{delay:B%3*100,children:e.jsx(ti,{card:I,onFavourite:de,isFav:p.includes(I._id),onBookNow:_,onRate:(O,q)=>t(L=>({...L,[O]:q})),rating:r[I._id]})},I._id))})]}),e.jsx(ct,{}),e.jsx("div",{ref:P,children:e.jsx(y.Suspense,{fallback:e.jsx(Ht,{})})}),e.jsx(ei,{}),e.jsx("div",{ref:A,id:"about-us",children:e.jsx(oi,{onBookNow:_})}),e.jsx("div",{id:"footer",children:e.jsx(Dt,{})}),c&&e.jsx(pt,{user:a,onClose:()=>d(!1)}),e.jsx(ht,{open:m,onClose:()=>l(!1),onItinerary:Q}),n&&e.jsx(ri,{itinerary:n,onPlanAgain:J}),e.jsx(ii,{open:g,onClose:()=>u(!1),wishlist:p,items:f}),e.jsxs("button",{className:"fab-wishlist",onClick:()=>u(!0),children:[e.jsx(se,{}),p.length>0&&e.jsx("span",{className:"fab-badge",children:p.length})]}),F&&e.jsx("button",{onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),style:{position:"fixed",bottom:100,right:30,width:44,height:44,borderRadius:"50%",background:"var(--ink)",color:"white",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",boxShadow:"0 4px 16px rgba(0,0,0,0.25)",zIndex:800},children:"↑"})]})}const si=D.memo(ai);export{si as default};
