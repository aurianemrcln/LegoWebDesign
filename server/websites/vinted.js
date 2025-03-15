import { v5 as uuidv5 } from 'uuid';

//const { title } = require("process");

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
          "cookie": "v_udt=bFp0eUZNS1V1T3I0b1VWVEpkWWpCWUFQMTEzQS0tZWdUcTk4c0FHb0RTVDc0My0tMjdPeDFCUkErOW9ML0t4L05YUi80UT09; anonymous-locale=fr; anon_id=98bb9607-00c4-4fc4-a3af-62b0b17ed510; anon_id=98bb9607-00c4-4fc4-a3af-62b0b17ed510; OptanonAlertBoxClosed=2025-03-10T17:15:41.012Z; eupubconsent-v2=CQODSZgQODSZgAcABBENBgFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSwAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBHACWAE0AKMAVoAwwBlADRAGyAO8Ae0A-wD9gIoAjABQQCrgFiALmAXkAxQBtADcAHEAOoAh0BF4CRAEyAJ2AUOAo-BTQFNgKsAWKAtgBcAC5AF2gLvAXmAvoBhoDHgGSAMnAZVAywDLgGcgNVAawA28BuoDiwHJgOXAeOA9oB9YEAQIWkACYACAA0ADnALEAj0BNoCkwF5ANTAbYA24Bz4DygHxAP2AgeBBgCDYEKyEBsABYAFAAXABVAC4AGIAN4AegB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; domain_selected=true; __cf_bm=di1Q5pCcRIXwNuXPU4t_LQ.CZMxeG0_op8cJd2PRxkA-1742057495-1.0.1.1-MIloBph4Fu73aZSesqPLYxMcuAlLt0oWaUCJSkAd2KfsBez0zAzlwi9TbhLj4e1svKSX5vir8Mi3dBmTgGLncVQYGiwjFgdlD5KfxMsl4AD.WnZWUw_OJG.Py6mQaamV; cf_clearance=TW6aKonsu_48jDfh1lomlgMY_FWVL3cAys3jRPMPxF4-1742057504-1.2.1.1-3EsyM97hf99rRtwOLt5G_W0nI_Cfl14gOmPcqKyUDZgcFFzWEbAoKhLrbGL9uEMs1jffHRQ.mXsfF28TsaIzfUzBoh4zJ.KQ4p4za9LxLRuvw4VeIddPEWcIaPBfhiGPGRBHP_DJuiLOBz9ftiQh_oSvgTiwXfRy7hZUFeFWcvJTdkfFkmyGFn10UmmERsvezKAXVOvT6QBzA7iWpaYwwBtxF.TI14WaWpFOcxF5RD_nvLYIjtHqMfBvHM6v4hCd3Ft7RE7KehiQHpD5qUGBoepGfGyzZ8_60zFBI2d3GowxjyxuvLNKmUEKlX4l8zWkhZyIORx7fLP..u_4xoXEVm7S3GJFP_zqIPWyoxr6ZEQ; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyMDU3NTA1LCJzaWQiOiJlYzRlZWVmMy0xNzQxNjI2OTM5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIwNjQ3MDUsInB1cnBvc2UiOiJhY2Nlc3MifQ.vylByuXZsJinxt_inOLJU34vDDKLiXrxu46fQ_tveEI71WnKRxwJ0g2Ha60hfrtFZzoNu_BvNo7JjVNIXwdlLtCqpQ5HAnxjHfEs0zwHKvwzTolPT-Y6gUX99hjpigwr6mc8dHWSCAjr-zp5inFu-XD_8cxUVKabN1nSXdw-oERHorVcYXwms2CH8ldqpsibbNdXATU6pWlp9B3AtyAsMpftu1u_A5wOjo3PFXJFgLotDFNDePoHsma7iM-1XIT7ABEyDzor62acNjCmwNKl0Lp4QmJa5p6AOvZ8mkLrErgtq9KcM7KsQLVUHxV1QBL-rxnnInvhykis5EvVHhjygQ; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQyMDU3NTA1LCJzaWQiOiJlYzRlZWVmMy0xNzQxNjI2OTM5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDI2NjIzMDUsInB1cnBvc2UiOiJyZWZyZXNoIn0.oiS0r8lLoGEfQYckgEzdtazLFWQU0JXNza24XSryFzK2cxxa47CmbGXyg9XmP9fO-PufIaQabwayeR2rzvgKSbq1URFQyJmVcaqO9xK_ku-OMvS9Uxl1VCeUUrNNg5o-3AaSVvRe1XZLWU8q91YWuVRnZZRlpZGkFnrkTQzOMBgRbhx5KYJqxzZgOzyYnbEjDbJV_1YLP6YbGUGNs3mi9kHdO5_LDrcNb-64CDqe8IczNQ1SCA6lnt9xBJijGVLKiAB2G0VCIfbRiZ5BLNwdxyI5mAabLAu5HH58SnRS3s8vTBN4CWd0d18unnsDR2HqZKXEwGCIo2N1IoX0MlUvMQ; v_sid=ec4eeef3-1741626939; v_sid=ec4eeef3-1741626939; viewport_size=484; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Mar+15+2025+17%3A53%3A46+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=98bb9607-00c4-4fc4-a3af-62b0b17ed510&interactionCount=36&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3B&AwaitingReconsent=false; _vinted_fr_session=ZER0OWNiY0NqTTZhNUVOdWt4c2tPN2tnWEhobVdCYjZuUkdldXM1YzRxUlBLWGpWOWJMY0YvVE1DWVdGdXoxRDdDTDNFZEpDYklVSkM1Wk1EU2VXSUpQQStuSDZlZmZ2WHNjQ3A1UVJYeWxwYyt6aVBqUkpzYWJwVUlQVWZlTUtDcGhYc2tXMDdzd1lTVzJZTnpxeHlaRE9FMkRoSzRIeE9pV1B5bXcxbTdqRTArQXJzTXFGNExTTXdRM3IzVWdnQU11OGIvWXhsWVhlM2p6Y0grS3RuYTZ2UHZuVFBOM3daR0ZEY1k4OFN3NU0xeTlIWThWRzRvck04a3lDQUkzY05OSGt5S2kwR3RuZWFJUlBNOFphWlEraVIvRzZ5T1ZuaDZKcXYxZVBtdzF4cERGM0xndForOTBPVjNiMXh0SkNvNjFBN01TakpQeXltQ3RRQXFUdmpaOTFmMk5FNGxmRzFZWGRnZDdNbUU5Mjk2S01NNEl1Sy9JaU9HcEtDNEsremVvN3VjS1VqbnJOVU1seFcreUJoaHVOWWZRNklZa2RxTGVtaXhvb2k4NGY3STN3NkhySitSRkxaYVVva0N4NkRpWEtWTGU0L3R6eWtZTlhaMVREeGlueWlxaGRGU3hpdEtpWWx5bWpqODlMZ0lPTDJPNFUzUU1wMmN0MFBaNEU3TXlpci8ySGVMRmN3RHVONzFhR1NWOUcyVkJIeG5OWXphTU1INjhscXE5VVZqUlJYdWptWW0wYVAyS3lwSXdBVVdSMlExVWtFSlhsNG1qRlhIK3RPZzN0L3hWOUNMek5LWGc4aHVRSmJhNDRKY0tQM0p4bVhRNXRoemVhd3RGOWx2M3Fab2dQdHhPY3JEOXBIUm8yaEN1QXMvaThOV2ZlSW0rTlZzTEtTNlJQMWN6bCtreUpTY21VNVg0TTVBUlc3a2d3RlZTZGQ2UXk1cUg4SjdUMDZ4S21LdWhhaWVPcTlEb29LVE5Oc2R0ZkYxY3VvOVdOZnFBSWJGMXJpNU53enBua1BQdXp0blFtN2ZWZDJuVzVpeTUrOHdPeWRlaHI0QU1aT1Nvd2Ric1FaYXBUcmhYaG1GU2tsQXhhUTVqMTNnaFpsVWZxOSt4MkV3T3RFYUszY1BhR0Z3RmFuSWxydjhhazMrTXZVUVVHbG9nYzFjcDArb2ljUDlmRUxyaTN1SFBiSWZyejdBUFA1Y1YvZFRYaW5jNFlDVkNKR0J3dU9UUjVvT0xQLzl1R010d0hhZ2NrdHFGMVA2aXRSQWRBTGpwTkZEck93UytMYk1wQURsSWo4aVZHOFlnUFU3OFUyVFhkYWk1aU9haGs1cU1xUXVRcHVPeFFqaTFRMzVlWmN4MnU1Vlp1Z2ViNC9TY3lpdHpsa3NNbEFsdUdNanhTRjl6YzJYaU5PdFlYT1dCMWR6NlVSZVdRNk5Kci9FdzJJM3VicXExS0g5U3NEcjc1ZHNOSWZ1KzhxSDVrQ0tkS0h3Wit2UTZjZE5FanBmU3lZMEZ3NEl1RTZOTnc0bE1ibVRkMndmRWxYTTBFbjdhYllNbnFyUkdrbVIvTFp6aXJEeVQ2cEZqOEd3RDdLQzIwcUJFT2xpU1MrM3lvclRGTWMwZ3QrR0RoUkk4MDNoa25mYnNqeFJvdlQxSk8wblRLMG1XaUhTYjRaNTBEOG84aThjVFpIdXA1M1ZWcm5Pc284MmpMTDlaNlNBSWFPMWJTclVtTDI1ZWFjZ21RbEhUM2h0bTJGMzE2VHhqRTF3cXR2RUQ3TUZPUmIrMksrdEpRY01ZaWxqSmNmYTBUT0J3czVWYitGcDZsMnV3VXZJWng1RExPbWpzbzRVK1MrRmx3WUpVNTZ5cEZtMWNLYUlEMEJBa21CSnJrM0RKRWlwZDNGMGUrRDNmREtHeUhoMnM2S2FBNnVqNlRsdHBBS0VMalZaTmVFU3k3dkU1U3Q4eVhvaWxJQitNWDJPeVI5VTVtMnY1TFJNT0U1c29YSllReG9VdGt5Tzlic3VWb2VsaU9BNW5JNFpMY2JmWkpVTExycW9YZmlYb0MxUXZES0x6WStHTXZHblNtd09lbkNOV3Z5R21uR2QzYkc1QldtbThQZXh4eEhNay9BWjUvdXp0VTlIRGJIMHM2WmpTWk1MZ1NPQm55MFlsTkU5YkRyZS8yRmttUUZ0OXkvQ1cyWDlUOXQ2YTlWSTJZVlpZejZldXdzZGxVcFE1cjRmcHpLMHhKVWQ4bmRjcGF4aldPQUpXZjJjenhjWXNIZDI2a25ncDEwdm5XVnBWdlc2V2QxS01rd08zd2dYczdxTjZtTmxjeUJRaTUyT1FycEVNQk5CamZqakhkdUk3eTlFK1QrekVzelVyT3Ivb3QxYmkxQi9jYS0tVWJxVVJDL29zT3JvNnI0Y0plOVJndz09--480cb0a20f74d1233cd691ecf70c21dfb7393608; datadome=_tQuA59oTPJba5OW7rvCqQYiUphfFhJy5yj9YtXkczG139Wj2MyAN2qXhQDzoUZlo8FWEO03EQ3jWp5WUArM04MWZAs3lbxRj0bk7ZGI_gX7ocd9yA4xXiJIBkiG6k93; banners_ui_state=PENDING",
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







/*
const scrapeWithNoCookies = async searchText=> {
    try{




    console.error(response);

    return null;
    }
    catch (error){
        console.error(error);
        return null;
    }
}*/