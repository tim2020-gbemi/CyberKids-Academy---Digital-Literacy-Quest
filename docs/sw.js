/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "402b66900e731ca748771b6fc5e7a068"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "77ae343bfbef781b66dbf5a764126e68"
  }, {
    "url": "pwa-512x512.png",
    "revision": "890bb931772639c13b1a7f07456afd93"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0ae533e4593910b71ad8937d969b4e7d"
  }, {
    "url": "index.html",
    "revision": "917a40c3e02874b8d63582b7944c4091"
  }, {
    "url": "icon.svg",
    "revision": "7a2dad3ac995704c3aa018a05a1f6728"
  }, {
    "url": "icon-maskable.svg",
    "revision": "d1cc23064a947f71ba12b0a442959522"
  }, {
    "url": "favicon.ico",
    "revision": "9a3ae0e6b6f7018ba5bbead37266f8e7"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "4f1bdc530e54dc18e8fa224e8f032e6c"
  }, {
    "url": "assets/mascot_cyber_pup_1792589675098-B1sKXn7_.jpg",
    "revision": null
  }, {
    "url": "assets/index-Dk5r_ovw.js",
    "revision": null
  }, {
    "url": "assets/index-CM-WsJGi.css",
    "revision": null
  }, {
    "url": "assets/digital_literacy_hero_1792589677037-Cp4bXU-G.jpg",
    "revision": null
  }, {
    "url": "assets/cyber_citizen_badge_1792589677656-BMNqjc9D.jpg",
    "revision": null
  }, {
    "url": "assets/images/mascot_cyber_pup_1792589675098.jpg",
    "revision": null
  }, {
    "url": "assets/images/digital_literacy_hero_1792589677037.jpg",
    "revision": null
  }, {
    "url": "assets/images/cyber_detective_kids_1792589680641.jpg",
    "revision": null
  }, {
    "url": "assets/images/cyber_citizen_badge_1792589677656.jpg",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "4f1bdc530e54dc18e8fa224e8f032e6c"
  }, {
    "url": "favicon.ico",
    "revision": "9a3ae0e6b6f7018ba5bbead37266f8e7"
  }, {
    "url": "icon.svg",
    "revision": "7a2dad3ac995704c3aa018a05a1f6728"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0ae533e4593910b71ad8937d969b4e7d"
  }, {
    "url": "pwa-512x512.png",
    "revision": "890bb931772639c13b1a7f07456afd93"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "77ae343bfbef781b66dbf5a764126e68"
  }, {
    "url": "manifest.webmanifest",
    "revision": "23e6f86185d78dd200262aa989bae3d4"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
