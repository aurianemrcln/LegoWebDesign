const { title } = require("process");

const parse = data => {
    try{
        const {items} = data;

        return items.map(item => {
            const link = item.url;
            const price = item.total_item_price;
            const {photo} = item;
            const published = photo.high_resolution && photo.high_resolution.timestamp;

            return {
                link,
                'price': price.amount,
                title: item.title,
                'published': (new Date(published * 1000)).toUTCString(),
                'uuid': uuidv5(link, uuidv5.URL)
            }
        })
    }
    catch(error){
        console.error(error);
        return [];
    }
};


const scrape = async searchText=> {
    try {
        const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1741630196&search_text=42151&catalog_ids=&size_ids=&brand_ids=&status_ids=&color_ids=&material_ids=`,{
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=0, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "v_udt=bFp0eUZNS1V1T3I0b1VWVEpkWWpCWUFQMTEzQS0tZWdUcTk4c0FHb0RTVDc0My0tMjdPeDFCUkErOW9ML0t4L05YUi80UT09; anonymous-locale=fr; anon_id=98bb9607-00c4-4fc4-a3af-62b0b17ed510; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjI2OTM5LCJzaWQiOiJlYzRlZWVmMy0xNzQxNjI2OTM5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2MzQxMzksInB1cnBvc2UiOiJhY2Nlc3MifQ.XfABXaj9WyBhHO1pXEfOaC9DHibCL6xgpU_LvfGHXHg7MyOn_8d6oNF7nPp1Ds5lYMNQGMeI2lFq0jAv9Dzo3o_OpIimCLJXdqpR_mUMZU0t6Yh9l_ZdnMfJ9b9MiCYt05qVhYenudWj8crD07yYP-bx__Ul-0rT7P5dC9K3yXacvl7ntLzHxRWf99LoNe879hrMyMmeQsF-Aw7YuEosW6qc04lLhKCWirYmULVONRm_zRumFAxJCoui4HwEozFsU6RkGULHglklzdb2wVPIO9HxFb_WN4ksFIOYBAUVVNClHewXy4M5ceC1aw5oBInfn53o93rjSZLAHA90DGPKDA; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjI2OTM5LCJzaWQiOiJlYzRlZWVmMy0xNzQxNjI2OTM5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIyMzE3MzksInB1cnBvc2UiOiJyZWZyZXNoIn0.S3hz4oqDBUfDALpnh-8e-RlAhZ3YB74ArJG0Imq2h8sWML4YnCmPXavaNVTN90ocAWidGlmUWSUXCR7Pm4HMvuVqTbSBcat1uN_EvggDDdiEJhqhI_p8kujq8bwxIYsnT2_kUKEl2-T1Dmy-A0CTTX42uRwNE52WV5o9wi9CrqVHCSYmHN7T8mGRiRWSptHTsWxV-LhMOZjimdVVPE-_KELZgRSxtn-2YgF9v0oe3aeLe0v-rvm45jEQHlXIKRvBrzdqJr73ZKo8dtO4QrUMLOouLv3jwYala8fV2KcJPe-ZmhMbJp3NU6Pe0N28J8pozmNWB7-WsQwVtjrWFN0lhQ; anon_id=98bb9607-00c4-4fc4-a3af-62b0b17ed510; OptanonAlertBoxClosed=2025-03-10T17:15:41.012Z; eupubconsent-v2=CQODSZgQODSZgAcABBENBgFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSwAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBHACWAE0AKMAVoAwwBlADRAGyAO8Ae0A-wD9gIoAjABQQCrgFiALmAXkAxQBtADcAHEAOoAh0BF4CRAEyAJ2AUOAo-BTQFNgKsAWKAtgBcAC5AF2gLvAXmAvoBhoDHgGSAMnAZVAywDLgGcgNVAawA28BuoDiwHJgOXAeOA9oB9YEAQIWkACYACAA0ADnALEAj0BNoCkwF5ANTAbYA24Bz4DygHxAP2AgeBBgCDYEKyEBsABYAFAAXABVAC4AGIAN4AegB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; v_sid=5153879b3f7f359f0355f233516f79ea; domain_selected=true; __cf_bm=CfFb11caaMTlEXdJNoGjXyFICxQ6kUSBkOzCiW_CAs8-1741630182-1.0.1.1-zMund_t4A2Z2oR82HVeVwWQ6fJSirGkkzZIEcsY9.jPh1V6y9Z6DH4xcyghM4FSg5VHLCmhNPeysv.q0rePNlDmWyfD8SlUr_pohyJBCZRu.spMQwvFRAYH6I7M79pRb; cf_clearance=W0cTrPpbgQ1SHcTSO92GsPV3xAsvIVOSWiyc.L.cXsI-1741630183-1.2.1.1-kyYTtTr11I2JjBVhcqavYlMFI36OjsE8qiljf.40HtuUUaqkN2O_F6ZUOdfxvObVUjU9870GKM154uI3p.1sSUpjFkSufSy6pbj.QvdUFaWm1eZTicsQQcuYG2bDy44FscuVa3dc2qWfI96SNgbN2FjNcoFYR_7pu8CD3iFo0aS9HaaewJ5kvByyjGSK5S6yqNhdY5Di0cm9dr4N5cyqCl7BXMoEPm35JJ8javVXWEgdJZfvWUCrZy8pPVhXjqwed7fHqbfEqKZZU_RE59oOgrYWrI06v2yzSmVNYy1r1zbg8vpIcrwhmm6BpEPvlklOgIL8.zPmXdVW2isx95xfYNfpUlx164ssdSLEt._zlLOQVE6iM8qt7N0fsvkTk.U5mIbom6kXJuWnzxdZ3ZFLQqrJ12gQ4prXJObLNQJm23c; viewport_size=860; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+10+2025+19%3A10%3A12+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=98bb9607-00c4-4fc4-a3af-62b0b17ed510&interactionCount=27&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3B&AwaitingReconsent=false; _vinted_fr_session=aVRXbXJpVXhacXZvUG1OcnFGUW05eXROb3lmY3F3NXk3bUdhK2Q2L1FWT3dObnVBY2VtVGZRNmdQUE14SUdTK1J1SjdiOHJTdDEwUVB0S21yem5wLy9ab3J2eEh4bTZyU3Y0Z3F0WXJsNE1Qbk54S21YRlVybHIvR2c1c2dJaEpFNUt5Rlo3MG1aUjgvS1FjOGdiZHNwdEdMWnVNOW9BSVhlNjZmU3haVDdoaGwzbWI0LzB4cFdDU1hsVFJRTEZ3SGRXM0owU0htRDY0b3YrQVRobCtscnB5VGpxZW9Scy92Z25JUVhxMWpXcWVmZDU1QXZ2bHg1b2o0Z1BjM3A4Qi0tMmpLYm1CdGx3RkNzbUltVkFla2hEdz09--fe41a6e07b019a60004b9a1ea65b19c45bd5c83b; datadome=nl_IegHdd_yZxQQxFL~d_AEtS1D0vLx~eQGsOiqxNjuqxkqURlhLjc5QkH8w05TTm_BX7g0Y47kgouWy_Oo8dwPQ6~vH4w~PCA3Jxt5uvRRj1_gdYe1DtNo4HaliQNg3; banners_ui_state=PENDING"
            },


            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "fr",
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
                "x-anon-id": "98bb9607-00c4-4fc4-a3af-62b0b17ed510",
                "x-csrf-token": "75f6c9fa-dc8e-4e52-a000-e09dd4084b3e",
                "x-money-object": "true",
                "cookie": "v_udt=bFp0eUZNS1V1T3I0b1VWVEpkWWpCWUFQMTEzQS0tZWdUcTk4c0FHb0RTVDc0My0tMjdPeDFCUkErOW9ML0t4L05YUi80UT09; anonymous-locale=fr; anon_id=98bb9607-00c4-4fc4-a3af-62b0b17ed510; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjI2OTM5LCJzaWQiOiJlYzRlZWVmMy0xNzQxNjI2OTM5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDE2MzQxMzksInB1cnBvc2UiOiJhY2Nlc3MifQ.XfABXaj9WyBhHO1pXEfOaC9DHibCL6xgpU_LvfGHXHg7MyOn_8d6oNF7nPp1Ds5lYMNQGMeI2lFq0jAv9Dzo3o_OpIimCLJXdqpR_mUMZU0t6Yh9l_ZdnMfJ9b9MiCYt05qVhYenudWj8crD07yYP-bx__Ul-0rT7P5dC9K3yXacvl7ntLzHxRWf99LoNe879hrMyMmeQsF-Aw7YuEosW6qc04lLhKCWirYmULVONRm_zRumFAxJCoui4HwEozFsU6RkGULHglklzdb2wVPIO9HxFb_WN4ksFIOYBAUVVNClHewXy4M5ceC1aw5oBInfn53o93rjSZLAHA90DGPKDA; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwiaXNzIjoidmludGVkLWlhbS1zZXJ2aWNlIiwiaWF0IjoxNzQxNjI2OTM5LCJzaWQiOiJlYzRlZWVmMy0xNzQxNjI2OTM5Iiwic2NvcGUiOiJwdWJsaWMiLCJleHAiOjE3NDIyMzE3MzksInB1cnBvc2UiOiJyZWZyZXNoIn0.S3hz4oqDBUfDALpnh-8e-RlAhZ3YB74ArJG0Imq2h8sWML4YnCmPXavaNVTN90ocAWidGlmUWSUXCR7Pm4HMvuVqTbSBcat1uN_EvggDDdiEJhqhI_p8kujq8bwxIYsnT2_kUKEl2-T1Dmy-A0CTTX42uRwNE52WV5o9wi9CrqVHCSYmHN7T8mGRiRWSptHTsWxV-LhMOZjimdVVPE-_KELZgRSxtn-2YgF9v0oe3aeLe0v-rvm45jEQHlXIKRvBrzdqJr73ZKo8dtO4QrUMLOouLv3jwYala8fV2KcJPe-ZmhMbJp3NU6Pe0N28J8pozmNWB7-WsQwVtjrWFN0lhQ; anon_id=98bb9607-00c4-4fc4-a3af-62b0b17ed510; OptanonAlertBoxClosed=2025-03-10T17:15:41.012Z; eupubconsent-v2=CQODSZgQODSZgAcABBENBgFgAAAAAAAAAChQAAAAAAFhIIIACAAFwAUABUADgAHgAQQAyADUAHgARAAmABVADeAHoAPwAhIBDAESAI4ASwAmgBWgDDgGUAZYA2QB3wD2APiAfYB-gEAAIpARcBGACNAFBAKgAVcAuYBigDRAG0ANwAcQBDoCRAE7AKHAUeApEBTYC2AFyALvAXmAw0BkgDJwGXAM5gawBrIDYwG3gN1AcmA5cB44D2gIQgQvCAHQAHAAkAHOAQcAn4CPQEigJWATaAp8BYQC8gGIAMWgZCBkYDRgGpgNoAbcA3QB5QD5AH7gQEAgZBBEEEwIMAQrAhcOAXgAIgAcAB4AFwASAA_ADQAOcAdwBAICDgIQAT8AqABegDpAIQAR6AkUBKwCYgEygJtAUgApMBXYC1AGIAMWAZCAyYBowDTQGpgNeAbQA2wBtwDj4HOgc-A8oB8QD7YH7AfuBA8CCIEGAINgQrHQSwAFwAUABUADgAIAAXQAyADUAHgARAAmABVgC4ALoAYgA3gB6AD9AIYAiQBHACWAE0AKMAVoAwwBlADRAGyAO8Ae0A-wD9gIoAjABQQCrgFiALmAXkAxQBtADcAHEAOoAh0BF4CRAEyAJ2AUOAo-BTQFNgKsAWKAtgBcAC5AF2gLvAXmAvoBhoDHgGSAMnAZVAywDLgGcgNVAawA28BuoDiwHJgOXAeOA9oB9YEAQIWkACYACAA0ADnALEAj0BNoCkwF5ANTAbYA24Bz4DygHxAP2AgeBBgCDYEKyEBsABYAFAAXABVAC4AGIAN4AegB3gEUAJSAUEAq4BcwDFAG0AOpApoCmwFigLRAXAAuQBk4DOQGqgPHAhaSgRgAIAAWABQADgAPAAiABMACqAFwAMUAhgCJAEcAKMAVoA2QB3gD8AKuAYoA6gCHQEXgJEAUeApsBYoC2AF5gMnAZYAzkBrADbwHtAQPJADwALgDuAIAAVABHoCRQErAJtAUmAxYBuQDygH7gQRAgwUgbAALgAoACoAHAAQQAyADQAHgARAAmABVADEAH6AQwBEgCjAFaAMoAaIA2QB3wD7AP0AiwBGACggFXALmAXkAxQBtADcAIdAReAkQBOwChwFNgLFAWwAuABcgC7QF5gL6AYaAyQBk8DLAMuAZzA1gDWQG3gN1AcmA8cB7QEIQIWlAEAAFwASACOAHOAO4AgABIgCxAGvAO2Af8BHoCRQExAJtAUgAp8BXYC8gGLAMmAamA14B5QD4oH7AfuBAwCB4EEwIMAQbAhWWgAgKbAAA.YAAAAAAAAAAA; OTAdditionalConsentString=1~; v_sid=5153879b3f7f359f0355f233516f79ea; domain_selected=true; __cf_bm=RgbWTBiKoBE.siEvQjZoEfMLOVwPlzTdPiokpiypLgw-1741633564-1.0.1.1-4euLs_lS0E7Z1Gi8AxTfxg.8p1cxBP0h4OwT1en.iNMjXxCiLybUGFrCTnvbyixGEDrFMFCsII_6Z7l5XVMvz6K5pFHbYHPWX2YHcWik7Cj04lfKMVT6PU8XV5U1TPCL; cf_clearance=03T1jQ5z6ihrLp7pnNuP.Dp3slbZI39tDcGuFU3rdGg-1741633565-1.2.1.1-J1fHqNCKVEFwj.D8dLYUzt6EHGZSa9i9TnXQXXc9D6d0OR65yqgh48bjY.puXHTrJ_sTaPUUkNcNoq2ckGsns9POc4Dr4ZpABmtkJ7pHH4S0e9BH8SXdzP1urVOQUodfARAvNEAdSV.vdRueFG_K3MMvVqSu68rIDV69AfIwv0EFU7f8UexX8Glha6bcdP1D.JappJJB2D2XI2RppnpLC35DHeamY4s1zwmc0fq_eOdKiwCUaui..zMHaUjXkCpufRNCITT75dNFWuvPdcWYttKYD1J2R2vB06F7bp8CFrr5qnJMrRyuLZOTiUd.dPF.jtcQ1KckErIdhBuf1brU53B1emLbhaWMSs_jco6YeoY; viewport_size=741; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Mar+10+2025+20%3A07%3A02+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=98bb9607-00c4-4fc4-a3af-62b0b17ed510&interactionCount=32&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0015%3A0%2CC0035%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3B&AwaitingReconsent=false; _vinted_fr_session=Q2hVZmRKS3U5VVEvSFlmNXcwdkM3MFFrY1Y5WHFmNHVnNEQzUE56dHp2aHRDYTcwbWtEZDk4cSs4VFBtbHpmNk5lUEsrQ3JXVUZqdW9yajkxQVg3ZU5XdnBzRVZ1WHVUUnlnbHdDZE5VMFpqaFZ3YXFwaGhncThRankycFFUY0djejZaTE1sV1V0Uy9od2tyWWJ5VGpZRFllWk5vZ3FtU05iWEt5a1ZrYzVIQmtnQUxnaGVVNDJZYzZDNkt3NkY0Mm5jQzZtU0VtVDk5b2xLbW8vb1AzSGxMUWFpcEpoOG84bDNuYlM2ODI0aXVOaVJNOXlhK0F3NzlWMkpBYlJqZS0tQ3hsYUk4aWlieUl5U01vN3l4dlNvUT09--19b3e7e8a12421f0f39e6a980561db124031db0b; datadome=fecbDPqd_kJPrDlXT4UzlcIDjzrLsrAe3q2d8UXIHEUXwMJ_KX3oYeOQNQWzUo8AosE5li9ALPg2op0_fBbjb4pDZMeEkCelLaEfB099_oooXgU1bT9GbPcjZ0ByBUny; banners_ui_state=PENDING",
                "Referer": "https://www.vinted.fr/catalog?time=1741633566&search_text=42151&page=1",
                "Referrer-Policy": "strict-origin-when-cross-origin"
              },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        });

        if (response.ok) {
            const body = await response.json();

            return parse(body);
        }



    }
    catch (e) {
        console.error(e);
    }
}



