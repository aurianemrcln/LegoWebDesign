import { v5 as uuidv5 } from 'uuid';

const parse = data => {
    try {
      const { items } = data;
  
      return items.map(item => {
        const link = item.url;
        const price = item.total_item_price;
        const { photo } = item;
        const published = photo.high_resolution && photo.high_resolution.timestamp;
  
        return {
          link,
          'price': price.amount,
          title: item.title,
          'published': (new Date(published * 1000)).toUTCString(),
          'uuid': uuidv5(link, uuidv5.URL)
        };
      });
    } catch (error) {
      console.error('Error parsing data:', error);
      return [];
    }
  };
  
  const scrape = async searchText => {
    try {
      const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1741630196&search_text=lego+${searchText}&catalog_ids=&size_ids=&brand_ids=&status_ids=&color_ids=&material_ids=`, {
        credentials: 'include',
        method: 'GET',
        mode: 'cors',
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-language": "fr",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
          "sec-ch-ua-arch": "\"x86\"",
          "sec-ch-ua-bitness": "\"64\"",
          "sec-ch-ua-full-version": "\"129.0.6668.59\"",
          "sec-ch-ua-full-version-list": "\"Google Chrome\";v=\"129.0.6668.59\", \"Not=A?Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"129.0.6668.59\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-model": "\"\"",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-ch-ua-platform-version": "\"19.0.0\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "x-anon-id": "98bb9607-00c4-4fc4-a3af-62b0b17ed510",
          "x-csrf-token": "75f6c9fa-dc8e-4e52-a000-e09dd4084b3e",
          "x-money-object": "true",
          "cookie": "v_udt=bFp0eUZNS1V1T3I0b1VWVEpkWWpCWUFQMTEzQS0tZWdUcTk4c0FHb0RTVDc0My0tMjdPeDFCUkErOW9ML0t4L05YUi80UT09; anonymous-locale=fr; anon_id=98bb9607-00c4-4fc4-a3af-62b0b17ed510; OptanonAlertBoxClosed=2025-03-10T17:15:41.012Z; eupubconsent-v2=CQODSZgQODSZgAcABBENBgFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSwAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBHACWAE0AKMAVoAwwBlADRAGyAO8Ae0A-wD9gIoAjABQQCrgFiALmAXkAxQBtADcAHEAOoAh0BF4CRAEyAJ2AUOAo-BTQFNgKsAWKAtgBcAC5AF2gLvAXmAvoBhoDHgGSAMnAZVAywDLgGcgNVAawA28BuoDiwHJgOXAeOA9oB9YEAQIWkACYACAA0ADnALEAj0BNoCkwF5ANTAbYA24Bz4DygHxAP2AgeBBgCDYEKyEBsABYAFAAXABVAC4AGIAN4AegB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=2ac093c7-1743541713; __cf_bm=QMTbMcpR89J9ExhtrJTFuRVq2tGYFD7Yai2904QXato-1743929949-1.0.1.1-Klmxo121kc3xWRLK_sJfr35gDtWnMT4VnRIJV1dWgdBIJvnyo_VD4QnTpNPiKr1eT3pp7HgiWcDRsgdXIm5ckZtORTFRaswC8a2LG4g90meKdmCyg3g2NO1bXxurkBlN; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTI5OTUwLCJzaWQiOiIyYWMwOTNjNy0xNzQzNTQxNzEzIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM5MzcxNTAsInB1cnBvc2UiOiJhY2Nlc3MifQ.q4N2HmNYMYDHGmgl3AC_zmldIH4PcRZDs6beGmf6cjhcHKgbtK77ZhmmVUCj32PswYQNC5R2uZ6zSTuAbgU1i9vI6JxBKZK8JjggZEgQGCRomow9g5UEP_CXWDGzNi2QHoKcIMMhvywd9XwFbjwBlQn5saRj9S9b6W37jKdJIvY11xaDWE0a1dIm1qASAeEk2oVnbSmHArn69SeCMxvg7QJl-5ccvdHPoogoi9IUSSIMDcrg7PAzv_pRJ9hl4Zn832Lr9KAWGT-wVxulOQp-5hk7zZzsz3RXWC1fLzkPZgW_4ce_1L4nPu2PH16MBeGdt0lWmovJuDR_v_oh0Y8oyg; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQzOTI5OTUwLCJzaWQiOiIyYWMwOTNjNy0xNzQzNTQxNzEzIiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDQ1MzQ3NTAsInB1cnBvc2UiOiJyZWZyZXNoIn0.hGmB-7hdlICaqgF2IfLhaJt_sfjZHZO5JHv6KmDjLXPOrXY6SwJTv-weEeTvDYYlv3_EupIhZcdendtAbmGt16Otw_67UsrMlxe9FLGmWRrdLI8Bc9cGEcFZ7A3BaqpN3WwBukDdkPVDI-7V4ukcEYZE06zP-KHL8yS_Kz72UnCio962c0FOeDmuhKOO4mbpJzuAnI0aXuF7viNBRj0inL1tP-oTheFO0Vt4_QXheKCwOYUAIZF8mYvf7N9DxZulynD2lMR9tTDfQkdxtIOlR9xejsXk4Fr7tTifcieovWAzEcea7A0jP51AuaFJL8g7cqL5SdpKsEjrpm6vxXN48g; cf_clearance=uWPYaOd6.dQx8ZO8Il9ARf49t6r4UjOIzHbHWT3wOpM-1743929950-1.2.1.1-bYcLJUjm7ZQwuxTrKIRUg3bGO2Wea_hQ2QVUl.rut1baHaE70DT_SX69ts.2jElPQNSugtcPAo7OZK9.qrYMUE9WZMKdej2DoS0phr8OYCb.6WQEmmdEWY5Qy.KnwtLsR2wjR1qJApAkmhFEcmKT3JEBs.GjHN32ulxYgcGe3X50Udq3Wt35VavLudOq.z21JHMXVqYav1huj8JmfFl61Ex6GKgqN63lP5.KxKYQT4ZdKbtAWJy_ACAhzPlSs57mXpIcgiGZh_5GE2kL2obo7IAqUH9s74.XQtfW4X_A5s_9HljkFBQpoeBipn6NxL_OaHC.AhiZt4jtieluchrKqZ2KLWXocRz7odPtVC42Nm8; datadome=FBPDX5pQvnMsZkhitgG9IWDGx2qzWIsgSEHX9UM8y01IIurZtkcf4EEPuyTr0ITy3HFCoGpokMmZ7s_9B6OrG9QsvHwfqsTAEIWbK~My5qLTXfJ4IDthCSyAeE4dGcYi; viewport_size=293; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Apr+06+2025+11%3A00%3A26+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=98bb9607-00c4-4fc4-a3af-62b0b17ed510&interactionCount=63&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3B&AwaitingReconsent=false; _vinted_fr_session=SkxvbGtVbW4yOHdGeTdaWmg5OHdOOHJZOUtFcHdnd3lneDFKV0ZhR01sd0xnVzQrTnVNM2VkZ2VZeXRzOTFBSHdCYlhiYkRFbHVSbjdQKzFET05aekxHRFE5L0hubnRjZ3oxckxPYmdIUGpVd3Ixc2tNQnhkUnBzY1VOcG5KUFJ3Q09OeGJ2NVNiOUtwNUNwc2YrVjNpdW5HTTNMdGJkK3FKSjd0MVNUL3ZHSDJGN0JwcTNwU3hpTUhYTGR0TzNCMHVZREIzaDZJaVg3dUUxVU82dkhKU0R2RXhpWHh2T3FiVUxqSStHZHR3RHBpNXhyTFNZeVVOdVlkZUN2d0xKRjBDR1hUZkk5QlhmTVVSZUtLQVJtQ0hwQm1LaXdRSWJOdFh0ZVZoaFlZdTZoS09MZloxbXdoY3Y2WHEvZzRCT05jY241YTFrV2xWUFlBL2FXMnJRWXNUNlVGQm9TcS9oa0VPaVQ2ZlIxSEZ4aGMzbFd0dEdJcVNEREE4THdLZGNlV1hiNkxkajJmTGJFY0prdU9hSGJQM2FkUDREY1RnbkhqWVc2NTBUVDZFeENrUDB5L3N1VEZLYUlZbWtKajRGR09HTER3Yy9Uc2FndkU3MUtoc25wZlNRRnJITy9hVFliM001ZWxwV3FLWjIvNFhXRnIzQmJ3SnE4ZkpiYUZ6VDFEYkJxQzhoUTd4S2NnQUlVUFZreWhzdTNJbXc2OHlwcWY5NHREdjAwU1JhZzVTSm1nWUlGdVNReVd3MnJ6aTY4YXR3d1hoZEllNFR1WExzdDVLZUFoeXg5UmxmK25HYmhwOXNUVVVHZEtjWEtLbHpNVERydjBHS042TG9jTGUyTmJqbi9ncWxmTDJ2dlpOOUgwTlYrZ1JGUWVoQTlmQjJTdTEzVXk0TmZERGtnQmJoaVZSNmdFZ0RzZDYxdndzdDEyT0dyUW9FbHQvL0xpbWNwS2JvVmc1Y3hCSGJiTVdpbDRrZ3dpMkFUaGFsa1ZDeEJtcnE4b0FIemsrMjlsNXZlN01vSzk3Vjg2RVpLLzZyd2VPMS9yUWlLckpNK0txbkpFNVNWRStORUI5RVdrdjJIYzJ6b1NsZGZHSlVEdUpUYU1tQUtvWHlzMUtDK2VmUHVOY1Z1Q2JNYk11QlR1dy9odXhEYUxuMXY5V1JEMXIxc0ZyM3RlTFZIejN6TnBEbVU3Yk5iZCtrV205ajUycFdmckhWeHhpbDgxd2VjUEw0QVBDSXdGOER5U1NZSTExTG1Rakt3SCttcW45dGYwaE9scnpicnlCMlpGamZESTBKa1ZSTmx2Y1VSNFBzMnk5OXFqY2p2UTdoMHo1OE1hT0VZbHNQbFRyVDNUUmhWSHkwdE44dCtCanQwNkxWWEFkRFBkMkZnR2wrOXczbmkra2diMUFCZGZpYlFVK3hvZWVBMTJkUlZGMXg3SjZGU04wUHhnbE9NTTFnc014VGVDNVJwTUxZajJUV2kxUzg5M0YxemNCbVFpZmF3NHErRWdoTXJJNFBONk83a09ZVTRBa0IyR0M2OEVReWlBZ3o5STJVRnQ3K1EvcVRmRS9uTjA3bGh1M3ZQci9Qb1RoQjZ3ZmI0VHgwMU9nWUg3YzV3R3hvOWJDeHlxczVGb0s5cmVuNk9IaDVUYkYyZnNwcmp3ZWpZMnpGWGcvekk0RGxOQlVNKy9uR09qbW12Y3dLb1c4WEo4V3NDdjl4REhTOEZUT2NTUUVkZk9BY2haWGtCY1R3UWFidXk4RndTUzdFQzdsQ3JES001elJ5SmlDTFRLYmN0SGd3alpmREhsMG9SOXFhc3NkSU5MMUtZVDZqRE9CbldYQTNCbHRpZ1piM2ZMbmFOZjRvV0gzejZ5NXBPVWFLVDk4dGozcTZRcHptSTJNN2M2VUZyZkl5elY2QUFnTEdtV0VCTDNUZmV2NTc2VklTcU9IT2psNmhXcTZ0TXQyazNraWM4aUZZOEozUzJ1N0lETWFwNGdGVkpNaEhKeDFUVjZneVQyM2RlSFhaZmZjNFI5K2pwcTYxVnorc1RDVWdKUGtnRy9JRzVQSzNRTWIxeFNtNGYvVjBRTFJkcHVWNFR3aW1GSmdMNGJSakpyQmJaVzZJdEhYY3lYL25ESzVuQy81MUQ2UmIzZU1QS1I0NFRxRGxJczdNcTh4bFQxZktaWVpuRjhZdW9yRnhiZFJvSTIxVi9XcGpHUzJib2ZtdERUYy92bmJXZnE5MnVvWFc2VXc1RitJeXZYRzVmYjJVd3UwVmFEb0pSRFc4NmM3aFQ2em4wL1gyOWpHRkdlbHA5SDVpaGR3U24zU0IzN2ZzdEtnbWtpeTdpNXhkbVZwRllRZHJtMDJ0UHgvQkFYUFMzQ2dWYmd1RTBTWU5mUTA0cy0tODVLQ1lGaWordGdGcjgySlFYUUJEdz09--7335f45d56a60cfb6a7d774271c2ae353d82e4fd; banners_ui_state=PENDING",
          "Referer": "https://www.vinted.fr/catalog?time=1741633566&search_text=42151&page=1",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        referrer: `https://www.vinted.fr/catalog?search_text=${searchText}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null
      });
  
      if (response.ok) {
        const body = await response.json();
        return parse(body);
      }
  
      console.error('Error fetching data:', response);
      return null;
  
    } catch (e) {
      console.error('Error in scrape function:', e);
      return null;
    }
  };
  
  export { scrape };