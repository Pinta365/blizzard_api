export { setup } from "./config.ts";
export { authenticate } from "./auth.ts";
export { request } from "./request.ts";

export type { KeyId, KeyNameId, LinkSelfHref, LocalizedString } from "./types.ts";

/*

Region		    Host					                    Available Locales
US  North America	https://us.api.blizzard.com/		  en_US
US  North America	https://us.api.blizzard.com/		  es_MX
US  North America	https://us.api.blizzard.com/		  pt_BR
EU  Europe        https://eu.api.blizzard.com/		  en_GB
EU  Europe        https://eu.api.blizzard.com/		  es_ES
EU  Europe        https://eu.api.blizzard.com/		  fr_FR
EU  Europe        https://eu.api.blizzard.com/		  ru_RU
EU  Europe        https://eu.api.blizzard.com/		  de_DE
EU  Europe        https://eu.api.blizzard.com/		  pt_PT
EU  Europe        https://eu.api.blizzard.com/		  it_IT
KR  Korea         https://kr.api.blizzard.com/		  ko_KR
TW  Taiwan        https://tw.api.blizzard.com/		  zh_TW

CN  China         https://gateway.battlenet.com.cn/ zh_CN

//StarCraft II region and realm IDs
Region	regionId	realmId
US	    1	        1
LatAm	  1	        2
Europe	2	        1
Russia	2	        2
Korea	  3	        1
Taiwan	3	        2
China	  5	        1
*/
