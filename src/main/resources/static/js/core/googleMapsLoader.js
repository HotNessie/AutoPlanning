/**
 * Google Maps JavaScript API를 동적으로 로드하는 공통 모듈
 */
let loadingPromise = null;

export function loadGoogleMaps() {
  // 이미 로딩 프로세스가 시작되었다면 기존의 Promise를 반환하여 중복 호출 방지 (싱글톤)
  if (loadingPromise) return loadingPromise;

  loadingPromise = fetch("/api/google-maps-key")
    .then(response => {
      if (!response.ok) throw new Error("API 키를 가져오는 데 실패했습니다.");
      return response.text();
    })
    .then(apiKey => {
      return new Promise((resolve, reject) => {
        try {
          // 구글 공식 동적 로더 스크립트 (g => { ... })
          (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await(a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
            key: apiKey,
            v: "beta"
          });
          
          // 로더가 실행되면 window.google 객체의 껍데기가 즉시 생성됨
          resolve(window.google);
        } catch (error) {
          reject(error);
        }
      });
    });

  return loadingPromise;
}
