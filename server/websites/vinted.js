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
      const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1741630196&search_text=${searchText}&catalog_ids=&size_ids=&brand_ids=&status_ids=&color_ids=&material_ids=`, {
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
          "cookie": "v_udt=bFp0eUZNS1V1T3I0b1VWVEpkWWpCWUFQMTEzQS0tZWdUcTk4c0FHb0RTVDc0My0tMjdPeDFCUkErOW9ML0t4L05YUi80UT09; anonymous-locale=fr; anon_id=98bb9607-00c4-4fc4-a3af-62b0b17ed510; OptanonAlertBoxClosed=2025-03-10T17:15:41.012Z; eupubconsent-v2=CQODSZgQODSZgAcABBENBgFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSwAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBHACWAE0AKMAVoAwwBlADRAGyAO8Ae0A-wD9gIoAjABQQCrgFiALmAXkAxQBtADcAHEAOoAh0BF4CRAEyAJ2AUOAo-BTQFNgKsAWKAtgBcAC5AF2gLvAXmAvoBhoDHgGSAMnAZVAywDLgGcgNVAawA28BuoDiwHJgOXAeOA9oB9YEAQIWkACYACAA0ADnALEAj0BNoCkwF5ANTAbYA24Bz4DygHxAP2AgeBBgCDYEKyEBsABYAFAAXABVAC4AGIAN4AegB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; v_sid=ec4eeef3-1741626939; __cf_bm=8bDx3RMngYp0CuHJPKzbGR6pfPDWMVVeoozERxsnNU8-1742822435-1.0.1.1-4ZVAK8hP.v91mpYLT8EUMtrRyUKg2zq8GLEMXe5ANK6J5zX5Y3ryvpIt6F8tja5qTaXShJtu7dimImqVYmyM.ZIas3wBm0MQ7HISIG11fP_dV6tIgKE3hGSH5180xALK; cf_clearance=xS3ZXEAUu9T60B_WHkdyHflvAYcDdWety633oCRCMeA-1742822436-1.2.1.1-AK540RcSjnq0CByLfs41aYE_Rj9ozTLWAuQ0E51lyu.q9XFyaX2VsQEOII9KjnchbcAYZcpArFtqT20XGvwhSW7QHHKVjcwZ7jqqo5OIUJR_HEi4NeKC5hEVtb_3ramaNEzsiVfY_te0jAiuOI3cbdWHIQ73TyIk2dIKmKXNf3Jfhwhd2oGonNUs7WFGT8xtTsJnHZxDn7o5ByEEM3dVGY7IQ4GSo9usRpbc.u6R0dnEPsZSjtKewXubhYavKZbgv_xk6cB4lNNap4WSQ4imVQh6YY.As.pSuQqngIyzkRdww4pmXjXy6Slpfza6WbIG6qIx3fOPNTEjvvK1ud4v8N4sq0xa8tEbIkKpzxvawcw; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyODIyNDM2LCJzaWQiOiJlYzRlZWVmMy0xNzQxNjI2OTM5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDI4Mjk2MzYsInB1cnBvc2UiOiJhY2Nlc3MifQ.x2ppQEcs0XnwJyOyoa1lJojpy8pgQdNynG_G1t14n3uilZFkY6MLyTCqqZsfaSpDvCfZoeA1wKdqYbYvt3YVicBT9tpUuR5cBa1mdlnWkgrrx1Fa1JsQNXJ6GRJelS57FSv9wVDlVa1iNh9ravwLPVvevgypVpbB0Dv9lpoymIzq8hUlupXCzNZUCRbPbnNLSdr14YyrXbMMZUbXjw8nATqit1L6BGmSb727VFnMqDz4c8rkaDinAh6DvrZCzcYLRgAfquVFf6Giw6pj4rKIosGZoGzD3bsrozvBsXNxnh9NrYGl-DAVoWiPBGjiCqreez-Os2XORy5rJdLZNkVqxQ; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyODIyNDM2LCJzaWQiOiJlYzRlZWVmMy0xNzQxNjI2OTM5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDM0MjcyMzYsInB1cnBvc2UiOiJyZWZyZXNoIn0.Y1N4P--_hAYFBqCZdaq7SGoMO6nCP2KMQ0I53XmFBLyKWe03X3ZvcLEFtUUyEZE8208HfobnridI-wa5fyLTY9aNzqQPlTaHz6qb9Tp6oAj7efmbYe2eMnQvs4sLWOGFIMtcSV_gXdElIRZJ0VBXMh5i7-F0YA_N-selBb_v48SMChJo-WMpGRMORYQFQ4o8OiukOiKcPz4Gw8j39wJ05UUVxHPfPsbbZgCugEpsCAOV7h7R3YSEQHnuxOPUnOkyrflH0naxcbecR5JJLGACAQYs0a2FvKZimdLQHKNTwxWVng9MmWlT-Md3fRMEvjglxgbyglA6-u-SKzPBgW-KSw; datadome=5TobIcHAvhGdwcnowTtmd3OkxK0HheWSiUSl4CMFCooWaZX825b6DdQ69psMiobH2OJTxyXClcyj2puGLAhC5H537L1_IVkpJGq62zGlP~5UFFKgxUfIEozfoEMHetYf; viewport_size=800; _vinted_fr_session=dytRTVpXdmQvS1dHNER4UzBEQ05qbGdlQmQ5V1lTbHdEZFV2L2RFWVdKSGc5NFdTWFI2K0ZlU0NYemdUQWZoa3lhVFFtUUFzaHM1YUZIS1haM3JaUzlBaFBZVncxVmlqSExqK3A0MGVYSTN5SGo1eWYxQzhwZWNoUWpKQnc4TERhM1JCYjA4KzZLeEx2UlVPODg3RmVsSWw0dXNLWlQ0K2gzaUVSbDNyUTVoektyeStZN3N1MFYvUit2WGw3elkycHJWbWExcFZaTUtPNFVLMmF2UnlmbTFRNVZhdExMeEY3UEhSRjV0MkZQbCtQRGpjODFyT1RHRmRwYXhQWDBGaHpuYlkxY2RGR2Z3ejJxRUh1VTc1SnVocXJBaVRhRXF4R2EveUtUVTYwdy9TZGNXanR1eW9ZV2s1VVJnY1ZWcnlTdTV6em4vTGRvOUFHQkdtdFNwV3JCblJabkRqejJsSlNGeUM5S3UyeGtDVFdEc2tnS0FzYnJWVGpNai9tSU5hR2w2NGZXR0hQN1czdHJoNFpnbHZYT0NySzB5OTRyMUZuRDNYUW5DYm5NbnBjd1NKL1pKZUpMekRpR2VwMWFscVFTMXVrdGlneG8xY2tqK09YMnZ4QzErTG43WWN2QVhGZEJCOHV2ckRJWVVVbUZnWkJzdVB0UnJrcTN1eWJEdGdBTDd3K1B0ck9OUWVZb0VRT2Z1U0VrZUp0eHFnbkc4b2NKc2N4aVJxdkk5V3ZPa001UWo1d3B1dlRkQUxXVTdUODNNVFcrdDZ2MmxMS2F1ZXhiajNManlsMlRobk52dWp5S1hDaEE5OVB5dU9pS2dNUWhRbmJkeHdLanZmeGpyVkFZdjJ1WUZFYlN6NGlsc25mdFBpRTBMNHNTcWx6ZmRMRStEekJUQjZTNUkrZWIzSjdkeTBFMlBGZ1ZucmRVODhqOEh2Q0x1Y1RSdWxOV3IvT0t6Z1VjZm5GWXR4Qm9qMHQwNXBDSGszQVpOOTRXMlI4RHM0cE1iblU1dnhQY0RaREFQdlFJUjFEcmFSZCtmaTlzMkMwV2JIdC8vRWpxVHk2THYrRHNPRXp3YnByWjJTb2pvZE05UXVJemY4QWNBZzJ2aWxrd3ZtOWNnbU5ZWWdPTWloUjhEcU5oSjZuYTlJbmFJQ1BZWG1lQ1YzcExoSUNFT0NUQnp1SUpLVTd2YkxhSXlTMFE2YTJVQnNqaWRhK3BKclJkVTg4cjYvNm9TYXNrN1JYTzhGVEZ3bERTTG5WZytLVjk5c3RyanFUMDlHejlhaVBQbHd6TU9qYnBPcVhBSHBBYnZrRktwcWdJUzFhZjdVNk0ySml3d0dNWi9xOElTOFBaQjNSVGpFMWtUblo3SUhjWmJPdmZuRTBKNUNSd241VTd0aDRkNmd5VmFVeXp1TExSWWJKRjBVb0JxTUFrV2RIdTljZEExTDJiM1pkYlJ6cGlnRm9QRjhBOFBWZXJqd1RmRUFnbGlZSzgwcGNMcUkzamlZemZhWDFHem4yTE5zaHE0MDJkQzd6UUJweTRZOTlKNmowQXF0SGxRd2F4ejlPSndsNDg2RjRab1ZsY1dUTm5RRjUwaFdPN1JNS0lQQkEyWklqUXZwS2VlemRCQXBFRFd0TDBueTExalRiWHQyWVFtcjRoN205NDFlL1gwY1M2dWtxZlBYcjY1NDVoVE96MGZrL0VoUWplbUx1eXRLWXFWUE0wa2cvMG5QQkN0b3dQUWtseXNGelIyZ2dkaEpWOFJiQ0t5aUNuRWR3UHdUdkJRNVBEMzFKUzFiM3pYYzFOL1lqNmtMRmU0TVVpcHdWa3FOSDNZekViREtNVmhYdnYwcjRYbE5YcXBrVm9ZaEd4eDZ0YlJwTGZ1aG9zRExlNGtSUkk2WTBNdUFOaGEzbWFzc1VWQjRQcUJaa0tVbWhMNGlkQUlZYmJ6U2ZvZG85aHpwcUpIUUxUdHVwNHRwdDhXYUcwbUNIOVJ0dFBhMW4zcFZXQytoUUErWWtuVlJsM002WUdJRVBSNGc2cUJsRlNBOGxCMUx5UittK2o4TWZLV1JYMjJCOU5PWlNwWFJ4SW5IOGN3YWgvYWtzR1hBVlo0NEtjTFNLNEJBZkt3QThWYlU4eS81c3laVVB1Uys1UTNVK2Jwb1NqaXhvTzNzbzAvNmdrWmpDT2xXalUyV2p0dGppMDVYVXg2YldKaFV2ZlRaVENIMnpiemxacnF1ZVZrL3lXK2lxWUswb1VRV01JZjFMUStzcWw3ZHVrRmZOb1lGRUVUemNLVzNnMWh6eDJYSkhURlV1c1VLdFd2ek9WZ2s2bzh1UFVpSnZZYlo1RCsyOEE0WVRVL0hZTUVCc29hZTB1SzE2cGl2aUZWdjlRVmxtWkpSZjNIYy0tNDYwK08rWnJTKzdyRWdIdy9wbEFqdz09--c3b3a76e792e8135ec3379701d2ca978440573fb; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+24+2025+14%3A21%3A32+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=98bb9607-00c4-4fc4-a3af-62b0b17ed510&interactionCount=56&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3B&AwaitingReconsent=false; banners_ui_state=PENDING",
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