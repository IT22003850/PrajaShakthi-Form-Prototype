import React, { useState, useEffect } from "react";
import provincialDataJson from "../data/provincial_data.json";

// Import the new components
import LocationSelector from "./LocationSelector";
import SectorSelector from "./SectorSelector";
import DynamicContent from "./DynamicContent";
import Proposals from "./Proposals";

  // The complete data structure for the form.
  const sectors = {
    "සමාජ පරිසරය (Social Environment)": {
      "මහජන උපයෝගීතා (Public Utilities)": {
        "විදුලිය (Power)": {
          problems: [
            {
              id: "noElectricity",
              label: "විදුලිය නොමැති වීම (Lack of Electricity)",
              type: "number",
            },
            {
              id: "lowVoltage",
              label: "අඩු විදුලි තත්ව අත් විදීම (Poor Electricity Supply)",
              type: "number",
            },
            {
              id: "solarUsage",
              label: "සූර්ය විදුලි පද්ධති භාවිතය (Use of Solar Power Systems)",
              type: "number",
            },
            {
              id: "threePhase",
              label:
                "තෙකලා විදුලිය අවශ්‍යතාවය ඇති (Three-Phase Electricity Requirement)",
              type: "number",
            },
          ],
        },
        "ජලය (Water)": {
          problems: [
            {
              id: "waterScarcity",
              label:
                "පානීය ජල පහසුකම් සපයා ගැනීමට දුෂ්කර නිවාස / පරිශ්‍ර සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "commonWaterSupply",
              label:
                "පොදු ජලසම්පාදන පද්ධතිය හරහා ප්‍රදේශයට ජල පහසුකම් සපයා ඇති නිවාස / පරිශ්‍ර සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "waterSourceIssues",
              label:
                "ප්‍රදේශයේ ජල මූලාශ්‍ර සම්බන්ධ ගැටළු සහගත තත්වයන් පවතී ද යන්න",
              type: "yesno",
            },
            {
              id: "ckduPatients",
              label:
                "දූෂිත ජලය භාවිතයෙන් හටගන්නා රෝගාබාධ (CKDU) වලින් පීඩා විදින පුද්ගලයින් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "roPlants",
              label:
                "ප්‍රති ආශ්‍රිත කරණ ජල පෙරන පද්ධති (RO Plant) මගින් ජලය සපයා ගන්නා නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "naturalDisasterThreat",
              label:
                "ස්වභාවික ආපදා තත්ව හේතුවෙන් වාර්ෂිකව තර්ජනයට ලක්වන ජල මූලාශ්‍ර හිමි නිවාස සංඛ්‍යාව",
              type: "number",
            },
          ],
        },
        "සනීපාරක්ෂක පහසුකම් (Sanitation Facilities)": {
          problems: [
            {
              id: "noWaterSealToilets",
              label: "ජල මුද්‍රිත වැසිකිළි පහසුකම් නොමැති පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "sanitationUpgradeNeeded",
              label:
                "සනීපාරක්ෂක පහසුකම් වැඩි දියුණු කරගැනීමට අවශ්‍ය පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "usePublicToilets",
              label:
                "දෛනික අවශ්‍යතා සඳහා පොදු වැසිකිළි භාවිතා කරන පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "femaleSanitationIssues",
              label:
                "කාන්තා සනීපාරක්ෂක පහසුකම් සපයා ගැනීමේ අපහසුතා ඇති පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "publicPlacesNoToilets",
              label: "වැසිකිළි පහසුකම් නොමැති පොදු ස්ථාන සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "diarrheaCholeraCases",
              label:
                "පසුගිය වසරේ පාචනය හෝ කොලරාව වැනි රෝගීන් වාර්තා වීම් සංඛ්‍යාව",
              type: "number",
            },
          ],
        },
        "වරිපනම් බදු ගෙවීම් (Property Tax Payment)": {
          problems: [
            {
              id: "nonPayingProperties",
              label: "වරිපනම් නොගෙවන නිවාස / පරිශ්‍ර සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "payableProperties",
              label: "වරිපනම් ගෙවීමට නියමිත නිවාස/ පරිශ්‍ර සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "skippedProperties",
              label: "වරිපනම් ගෙවීම මඟහැර ඇති නිවාස/ පරිශ්‍ර සංඛ්‍යාව",
              type: "number",
            },
          ],
        },
        "කසල කළමනාකරණය (Waste Management)": {
          problems: [
            {
              id: "wasteManagementUncovered",
              label:
                "පළාත් පාලන ආයතන මගින් සිදු කරන කසල කළමනාකරණය යටතේ ආවරණය නොවන නිවාස / පරිශ්‍ර සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "wasteManagementCovered",
              label:
                "පළාත් පාලන ආයතන මගින් සිදු කරන කසළ රැස් කිරීම යටතේ ආවරණය වන නිවාස / පරිශ්‍ර සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "binsIssued",
              label:
                "කැළිකසල කළමනා කරණයට අවශ්‍ය බඳුන් නිකුත් කර ඇති නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "homeComposting",
              label:
                "ගෙවත්ත තුළ කොම්පෝස්ට් කරණය සිදු කිරීම සඳහා කටයුතු කරන නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "potentialHomeComposting",
              label:
                "කසල කොම්පෝස්ට් කරණය සිදු කිරීම සඳහා කටයුතු කළ හැකි මුළු නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "illegalDumpingSites",
              label:
                "කැළි කසල බැහැර කරන පොදු ස්ථාන සංඛ්‍යාව (අනවසර බැහැර කිරීම)",
              type: "number",
            },
            {
              id: "sludgeDumpingSites",
              label:
                "Sludge මණ්ඩි සහිත අපද්‍රව්‍ය බැහැර කරන ස්ථාන සංඛ්‍යාව (වැසිකිළි අපද්‍රව්‍ය වැනි)(අනවසර)",
              type: "number",
            },
            {
              id: "industrialWasteDumpingSites",
              label: "කාර්මික අපද්‍රව්‍ය බැහැර කරන ස්ථාන සංඛ්‍යාව (අනවසර)",
              type: "number",
            },
            {
              id: "waterwayDumpingSites",
              label:
                "කාණු පද්ධති සහ ජලාශ වෙත අපද්‍රව්‍ය බැහැර කරන ස්ථාන සංඛ්‍යාව (අනවසර)",
              type: "number",
            },
            {
              id: "recyclingCenters",
              label:
                "ප්‍රදේශය තුළ කසල ප්‍රතිචක්‍රීය කරණ මධ්‍යස්ථාන ස්ථාපිත නම් එම ස්ථාන සංඛ්‍යාව",
              type: "number",
            },
          ],
        },
      },
      "ඉඩම් අයිතිය පිළිබඳ තොරතුරු (Land Rights)": {
        problems: [
          {
            id: "illegalLandTenure",
            label:
              "නීත්‍යානුකූල බලපත්‍රයක් හෝ ඔප්පුවක් නොමැතිව අනවසරයෙන් ඉඩම් භුක්ති විඳින පවුල් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "landlessFamilies",
            label: "පදිංචියට ඉඩමක් නොමැති පවුල් සංඛ්‍යාව",
            type: "number",
          },
        ],
      },
      "නිවාස සම්බන්ධ තොරතුරු (Housing)": {
        "නිවාස භාවිතය": {
          problems: [
            {
              id: "rentedHouses",
              label: "කුළී නිවාසවල ජීවත්වන පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "temporaryHouses",
              label: "තාවකාලික නිවාසවල ජීවත් වන පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "dilapidatedHouses",
              label: "අබලන් වූ නිවාසවල ජීවත් වන පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "unsuitableLocations",
              label:
                "නේවාසික කටයුතු සඳහා සුදුසු නොවන ස්ථාන වල ඉදි කර ඇති නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "illegalConstructions",
              label: "අනවසර ඉදිකිරීම්වල ජීවත්වන පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "noLegalAccess",
              label: "නීත්‍යානුකූල ප්‍රවේශ මාර්ග නොමැති නිවාස සංඛ්‍යාව",
              type: "number",
            },
          ],
        },
        "ආපදා අවදානම් ඇති නිවාස": {
          problems: [
            {
              id: "landslideRisk",
              label: "නායයෑම් අවදානම සහිත නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "heavyRainWindRisk",
              label:
                "අධික වර්ෂාව සහ සුළං හේතුවෙන් අවදානමට ලක්විය හැකි නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "floodRisk",
              label: "ගංවතුර අධි අවදානම සහිත නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "seaErosionRisk",
              label: "මුහුදු ඛාදන අවදානම සහිත නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "otherRisks",
              label: "වෙනත් අවදානම් සහිත නිවාස සංඛ්‍යාව (සඳහන් කරන්න)",
              type: "text_with_number",
            },
          ],
        },
        "වතු නිවාස": {
          problems: [
            {
              id: "estateRooms",
              label: "වතු කාමරවල ජීවත් වන වතු පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "nonEmployeeEstateHouses",
              label:
                "වතු නිවාසවල ජීවත් වන වතු සමාගමට සේවය නොකරන පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "urbanEstateClusters",
              label: "නාගරික සමූහ (වතු) නිවාසවල ජීවත්වන පවුල් සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "multipleFamilyUnits",
              label: "පවුල් ඒකක එකකට වඩා ජීවත් වන ගෘහ ඒකක ගණන",
              type: "number",
            },
          ],
        },
      },
      "භාවිතයට නොගෙන අතහැර දමා ඇති රජයේ ගොඩනැගිලි": {
        isTable: true,
        tableColumns: [
          "ගොඩනැගිල්ල",
          "සමස්ත වර්ග ඵලය (වර්ග මීටර්)",
          "කලින් භාවිත කරන ලද කාර්යය",
          "අතහැර දමා ඇති කාලය",
          "ඉදිකිරීමේ ස්වභාවය (වැඩනිමකළ/අඩක් නිමකළ)",
        ],
      },
      "ශාරීරික සුවතාවය සහ විනෝදාශ්වාදය සඳහා ප්‍රදේශ": {
            isHybridTable: true, // Use a new, more descriptive property
            fixedColumnHeader: "ස්වරූපය",
            tableColumns: [
                "ග්‍රාම නිලධාරි වසම තුළ පිහිටා ඇත්ද (ඔව්/නැත)",
               "භාවිතා කරන්නන් සංඛ්‍යාව",
                "ආසන්නම ස්ථානයට දුර (කි.මී.)",
                "පහසුකම් ප්‍රමාණවත් ද (ඔව්/නැත)",
            ],
            // The truly fixed rows
            mainRows: [
                { id: "playgrounds", label: "ක්‍රීඩා පිටි" },
                { id: "childrensParks", label: "ළමා උද්‍යාන" },
                { id: "publicParks", label: "මහජන උද්‍යාන" },
                { id: "walkingPaths", label: "ඇවිදින මංතීරු" },
                { id: "outdoorFitness", label: "එළිමහන් ශරීර සුවතා මධ්‍යස්ථාන" },
                { id: "filmhalls", label: "සිනමාශාලා" },
                { id: "danceHalls", label: "නර්තන ශාලා" },
            ],
            // A template for the rows that can be added dynamically
            dynamicRow: {
                idPrefix: 'other',
                placeholder: "වෙනත් (සඳහන් කරන්න)"
            }
        },
      "සන්නිවේදනය (Communication)": {
        problems: [
          {
            id: "fixedLine",
            label: "ස්ථාවර දුරකථන පහසුකම් සහිත නිවාස / පරිශ්‍ර සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "fixedLineInternet",
            label:
              "ස්ථාවර දුරකථන සහ අන්තර්ජාල පහසුකම සහිත නිවාස/පරිශ්‍ර සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "fiberCoverage",
            label: "ෆයිබර් ජාල ආවරණය සහිත නිවාස/පරිශ්‍ර සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "broadbandCoverage",
            label: "Broadband ආවරණය සහිත නිවාස/ පරිශ්‍ර සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "mobileInternetSatisfaction",
            label:
              "ජංගම දුරකථන සඳහා අන්තර්ජාල පහසුකම් පිළිබඳව සැහීමකට පත්විය හැකි ද?",
            type: "select",
            options: ["ඉතා හොඳයි", "සාමාන්‍යයි", "දුර්වලයි"],
          },
          {
            id: "noCoverage",
            label: "ඉහත කිසිවකින් ආවරණය නොවන නිවාස/පරිශ්‍ර සංඛ්‍යාව",
            type: "number",
          },
        ],
      },
    },
    "ආහාර සුරක්ෂිතතාව (Food Security)": {
      "කෘෂිකර්මාන්ත (Agriculture)": {
        "ආහාර භෝග නිෂ්පාදනය": {
          isTable: true,
          tableColumns: [
            "භෝගය",
            "වගා කරන ඉඩම් ප්‍රමාණය (අක්කර)",
            "ජල කළමනාකරණය සහිත වගා ඉඩම් ප්‍රමාණය (අක්කර)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ඵලදාව (කිග්‍රැ)",
            "අක්කරයකට දැරිය යුතු වාර්ෂික වියදම (රු.)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ආදායම (රු.)",
          ],
        },
        "අපනයන භෝග නිෂ්පාදනය": {
          isTable: true,
          tableColumns: [
            "භෝගය",
            "වගා කරන ඉඩම් ප්‍රමාණය (අක්කර)",
            "ජල කළමනාකරණය සහිත වගා ඉඩම් ප්‍රමාණය (අක්කර)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ඵලදාව (කි.ග්‍රැ)",
            "අක්කරයකට දැරිය යුතු වාර්ෂික වියදම (රු.)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ආදායම (රු.)",
          ],
        },
        "සුළු අපනයන භෝග නිෂ්පාදනය": {
          isTable: true,
          tableColumns: [
            "භෝගය",
            "වගා කරන ඉඩම් ප්‍රමාණය (අක්කර)",
            "ජල කළමනාකරණය සහිත වගා ඉඩම් ප්‍රමාණය (අක්කර)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ඵලදාව (කි.ග්‍රැ)",
            "අක්කරයකට දැරිය යුතු වාර්ෂික වියදම (රු.)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ආදායම (රු.)",
          ],
        },
        "සම්ප්‍රදායික නොවන අපනයන භෝග නිෂ්පාදනය": {
          isTable: true,
          tableColumns: [
            "භෝගය",
            "වගා කරන ඉඩම් ප්‍රමාණය (අක්කර)",
            "ජල කළමනාකරණය සහිත වගා ඉඩම් ප්‍රමාණය (අක්කර)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ඵලදාව (කි.ග්‍රැ)",
            "අක්කරයකට දැරිය යුතු වාර්ෂික වියදම (රු.)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ආදායම (රු.)",
          ],
        },
        "ඖෂධ වගාව": {
          isTable: true,
          tableColumns: [
            "ඖෂධ වර්ගය",
            "වගා කරන ඉඩම් ප්‍රමාණය (අක්කර)",
            "ජල කළමනාකරණය සහිත වගා ඉඩම් ප්‍රමාණය (අක්කර)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ඵලදාව (කි.ග්‍රැ)",
            "අක්කරයකට දැරිය යුතු වාර්ෂික වියදම (රු.)",
            "අක්කරයකින් ලැබෙන වාර්ෂික ආදායම (රු.)",
          ],
        },
        "ගෙවතු වගාව": {
          problems: [
            {
              id: "activeHomeGardens",
              label: "ගෙවතු වගා පවත්වා ගෙන යන නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "potentialHomeGardens",
              label:
                "ගෙවතු වගා පවත්වා ගෙන යාමට සුදුසු එහෙත් වගාවක් නොමැති ඉඩම් සහිත නිවාස සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "potentialCoconutGardens",
              label:
                "පොල් ගස් වගා කිරීමට සුදුසු පොල් වගාව නොමැති ගෙවතු සංඛ්‍යාව",
              type: "number",
            },
            {
              id: "potentialJackfruitGardens",
              label: "කොස් වගා කිරීමට සුදුසු කොස් වගාව නොමැති ගෙවතු සංඛ්‍යාව",
              type: "number",
            },
          ],
        },
        "වගා හානි": {
    "ස්වභාවික ආපදා": {
        isHybridTable: true,
        fixedColumnHeader: "ආපදා තත්වය",
        tableColumns: [
            "පසුගිය වසරේ වගා හානි වූ ඉඩම් ප්‍රමාණය (අක්කර)",
            "පසුගිය වසරේ වගා හානි තක්සේරු වටිනාකම (රු.)"
        ],
        mainRows: [
            { id: "floods", label: "ගංවතුර" },
            { id: "landslides", label: "නායයාම්" },
            { id: "drought", label: "නියඟය" },
            { id: "strongWinds", label: "තද සුළං" }
        ],
        dynamicRow: {
            idPrefix: 'otherDisaster',
            placeholder: "වෙනත් (සඳහන් කරන්න)"
        }
    },
    "සත්ව හානි": {
                   isHybridTable: true, // Use the same, consistent type
                    fixedColumnHeader: "සත්ව වර්ගය",
                    tableColumns: [
                        "පසුගිය වසරේ වගා හානි වූ ඉඩම් ප්‍රමාණය (අක්කර)",
                        "පසුගිය වසරේ වගා හානි තක්සේරු වටිනාකම (රු.)",
                    ],
                    mainRows: [
                        { id: "elephants", label: "වන අලි" },
                        { id: "monkeys", label: "රිලව්" },
                        { id: "squirrels", label: "දඬුලේනුන්" },
                        { id: "otherWildAnimals", label: "වෙනත් වන සතුන් (ඉත්තෑවා, මොණරා, වල් ඌරා)" },
                        { id: "domesticAnimals", label: "ගෘහාශ්‍රිත සතුන්" }
                    ]
                    // Note: No 'dynamicRow' property makes this a purely fixed table
                },
},
        "කෘෂි තාක්ෂණය": {
          problems: [
            {
              id: "greenhouses",
              label: "හරිතාගාර සහිත ඉඩම් (වර්ග අඩි ප්‍රමාණය)",
              type: "number",
            },
            {
              id: "dripIrrigation",
              label: "බිංදු ජල තාක්ෂණය සහිත වගා ඉඩම් (වර්ග අඩි ප්‍රමාණය)",
              type: "number",
            },
            {
              id: "hydroponics",
              label: "Hydroponic තාක්ෂණය (වර්ග අඩි ප්‍රමාණය)",
              type: "number",
            },
            {
              id: "organicFarming",
              label: "කාබනික වගාවන් සිදු කරන ඉඩම් ප්‍රමාණය (අක්කර)",
              type: "number",
            },
          ],
        },
        "කෘෂිකාර්මික ඉඩම්": {
          isTable: true,
          tableColumns: [
            "ඉඩම් කළමනාකරණය කරන ආයතනය",
            "මුළු වගා ඉඩම් ප්‍රමාණය (අක්කර)",
            "ඉඩම් ඔප්පු නොමැති වගා ඉඩම් ප්‍රමාණය (අක්කර)",
            "වගා ඉඩම් මැනුම් අවසන් කර ඇති ප්‍රමාණය (අක්කර)",
            "වගා ඉඩම් මැනුම් කිරීමට ඇති ප්‍රමාණය (අක්කර)",
            "ගොවි කටයුතු සඳහා සංවර්ධනය කළ හැකි නව ඉඩම් ප්‍රමාණය (අක්කර)",
            "ගෙවතු වගා කටයුතු සඳහා සංවර්ධනය කළ හැකි ඉඩම් ප්‍රමාණය (අක්කර)",
          ],
        },
        "වගා නොකර අතහැර දමා ඇති වගාබිම්": {
          isTable: true,
          tableColumns: [
            "ඉඩම් වර්ගය (කුඹුරු/නොවන)",
            "මුළු වගා ඉඩම් ප්‍රමාණය (අක්කර)",
            "අතහැර දමා ඇති කාලය",
            "ගොවි කටයුතු සඳහා සංවර්ධනය කළ හැකි/නොහැකි බව",
            "කළින් වගා කළ භෝග වර්ගය",
            "ඉඩමේ අයිතිය",
          ],
        },
        "වාරි මාර්ග පද්ධති": {
          isTable: true,
          tableColumns: [
            "වාරි මාර්ගය (නම)",
            "නඩත්තු කරන ආයතනය",
            "පෝෂණය කළ හැකි මුලු ඉඩම් ප්‍රමාණය (අක්කර)",
            "පෝෂණය වන මුලු ඉඩම් ප්‍රමාණය (අක්කර)",
            "ගම තුළ පවතින මුලු වගා ඉඩම් වලින් පෝෂණය වන ඉඩම් ප්‍රමාණය (%)",
            "වර්තමාන තත්වය (නඩත්තුවක් අවශ්‍ය නැත/අවශ්‍යයි/පිළිසකර කළ යුතුයි)",
          ],
        },
      },
      "පශු සම්පත් (Livestock Resources)": {
        isTable: true,
        tableColumns: [
          "සතුන් වර්ගය",
          "ගොවිපළ/නිවාස සංඛ්‍යාව",
          "දෛනික මාංශ නිෂ්පාදනය (කි.ග්‍රෑ)",
          "දෛනික කිරි නිෂ්පාදනය (ලීටර්)",
          "දෛනික බිත්තර නිෂ්පාදනය (සංඛ්‍යාව)",
        ],
        extraFields: [
               { id: "totalFarms", label: "ප්‍රදේශයේ පවතින මුලු ගොවිපළ සංඛ්‍යාව", type: "number" },
                { id: "grasslandArea", label: "ප්‍රදේශයේ පවතින තෘණභූමි ප්‍රමාණය (අක්කර)", type: "number" },
           ]
      },
      "ධීවර කර්මාන්තය (Fisheries Industry)": {
                isHybridTable: true,
               fixedColumnHeader: "අංශය",
                tableColumns: [
                   "රැකියාවේ නිරත ධීවරයින් සංඛ්‍යාව",
                    "පන්න වර්ගය (දැල් වර්ග)",
                   "සාමාන්‍ය දෛනික මත්ස්‍ය අස්වැන්න (කි.ග්‍රෑ)",
                   "දෛනික කරවල, උම්බලකඩ ආදී නිෂ්පාදන (කි.ග්‍රෑ)"
               ],
                mainRows: [
                    { id: "karadiya", label: "කරදිය මත්ස්‍ය" },
                   { id: "miridiya", label: "මිරිදිය මත්ස්‍ය" },
                    { id: "prawns", label: "ඉස්සන්" },
                    { id: "crabs", label: "කකුළුවන්" }
                ],
                dynamicRow: {
                    idPrefix: 'otherFishery',
                    placeholder: "වෙනත් (සඳහන් කරන්න)"
                }
            },
      "ජල මූලාශ්‍ර (Water Resources)": {
                isHybridTable: true,
                fixedColumnHeader: "මුලාශ්‍රය",
               tableColumns: [
                    "නම් කර ඇති ආකාරය",
                    "භාවිතා කරන කාර්යය"
                ],
                mainRows: [
                    { id: "waterfalls", label: "දිය ඇලි" },
                    { id: "tanks", label: "වැව්" },
                    { id: "reservoirs", label: "අභ්‍යන්තර ජලාශ" },
                    { id: "rivers", label: "ගංගා" },
                    { id: "canals", label: "ඇළ දොළ" }
                ],
                dynamicRow: {
                    idPrefix: 'otherWaterSource',
                    placeholder: "වෙනත් (සඳහන් කරන්න)"
                }
            },
    },
    "සැපයුම් ජාල සහ ප්‍රවේශය (Supply & Access)": {
      "මාර්ග පද්ධතිය පිළිබඳ තොරතුරු": {
        isHybridTable: true,
        fixedColumnHeader: "වර්ගය",
        tableColumns: [
            "දිග (කි.මි.)",
           "ආරම්භක ස්ථානය",
            "අවසන් වන ස්ථානය",            
            "සංවර්ධනය කළ යුතු කොටසේ දිග (කි.මි.)",
        ],
        mainRows: [
            { id: "road_a", label: "A" },
            { id: "road_b", label: "B" },
            { id: "road_c", label: "C" },
            { id: "road_d", label: "D" },
            { id: "road_e", label: "E" }
        ],
        dynamicRow: {
            idPrefix: 'otherRoad',
            placeholder: "වෙනත් (සඳහන් කරන්න)"
        }
    },
      "සංවර්ධනය විය යුතු මාර්ග යටිතල පහසුකම්": {
        isTable: true,
        tableColumns: ["යටිතල පහසුකම", "මාර්ගයේ වර්ගය (A,B,C...)", "පිහිටීම"],
      },
      "මූලික සේවා සඳහා ප්‍රවේශය": {
        isHybridTable: true,
        fixedColumnHeader: "සේවා මධ්‍යස්ථානය",
        tableColumns: [
            "කොට්ඨාසය තුළ පිහිටා තිබේද?",
            "ගමන් කළ යුතු දුර (කි.මි.)",
            "භාවිතා කරන ප්‍රවාහන මාධ්‍ය",
            "ගත වන කාලය"
        ],
        mainRows: [
            { id: "rural_hospital", label: "ග්‍රාමීය රෝහල" },
            { id: "base_hospital", label: "මූලික රෝහල" },
            { id: "district_hospital", label: "දිස්ත්‍රික් මහ රෝහල" },
            { id: "teaching_hospital", label: "ශික්ෂණ රෝහල" },
            { id: "health_clinic", label: "සෞඛ්‍ය සායන මධ්‍යස්ථානය" },
            { id: "primary_care_unit", label: "ප්‍රාථමික වෛද්‍ය සත්කාර ඒකක" },
            { id: "pharmacy", label: "ඔසු සල්" },
            { id: "ayurvedic_hospital", label: "ආයුර්වේද රෝහල / නිදහස් ආයුර්වේද මධ්‍යස්ථානය" },
            { id: "private_medical_center", label: "පුද්ගලික වෛද්‍ය මධ්‍යස්ථාන" },
            { id: "preschool", label: "ආසන්නතම පෙර පාසල" },
            { id: "primary_school", label: "ආසන්නතම ප්‍රාථමික විද්‍යාලය" },
            { id: "maha_vidyalaya", label: "ආසන්නත්ම මහා විද්‍යාලය" },
            { id: "public_library", label: "මහජන පුස්තකාලය" },
            { id: "divisional_secretariat", label: "ප්‍රාදේශීය ලේකම් කාර්යාලය" },
            { id: "pradeshiya_sabha", label: "ප්‍රාදේශීය සභාව" },
            { id: "police_station", label: "පොලිස් ස්ථානය" },
            { id: "public_market", label: "පොදු වෙළෙඳපොළ" },
            { id: "wholesale_market", label: "තොග වෙළෙඳපොළ" },
            { id: "financial_institutions", label: "මූල්‍ය ආයතන" },
            { id: "post_office", label: "තැපැල් කාර්යාලය" },
            { id: "cemetery", label: "පොදුසුසාන භූමිය / ආදානාගාරය" },
            { id: "main_road", label: "ප්‍රධාන මාර්ගය ( පොදු ප්‍රවාහන් සේවා සහිත )" }
        ],
        extraFields: [
            { id: "transport_frequency", label: "ගම්මානය හරහා / ගමේ සිට ගමන් කරන පොදු ප්‍රවාහන සේවා ක්‍රියාත්මක වන කාල පරාසය (Frequency)", type: "text" },
            { id: "bus_count", label: "පොදු ප්‍රවාහනයට යොදවා ඇති බස් රථ ගණන", type: "number" }
        ]
    },
      "පොදු වෙළඳපොළ මධ්‍යස්ථාන / නාගරික ඒකක": {
        isTable: true,
        tableColumns: [
          "ස්ථානය",
          "කළමනාකරණය",
          "නිෂ්පාදන අලෙවි කරන ගම්වාසීන්",
          "පාරිභෝගිකයන් සංඛ්‍යාව",
          "විදුලි පහසුකම්",
          "ගබඩා පහසුකම්",
          "කසල කළමනාකරණ පහසුකම්",
          "වැසිකිළි පහසුකම්",
          "රථවාහන නැවතුම් පහසුකම්",
        ],
      },
    },
    "මානව සම්පත් සංවර්ධනය (HR Development)": {
      "අධ්‍යාපනයට ඇති ප්‍රවේශය": {
        isHybridTable: true,
        fixedColumnHeader: "අධ්‍යාපන ආයතන",
        tableColumns: [
            "ග්‍රා.නි. වසම තුළ පිහිටා ඇත්ද?",
            "සිසුන් සංඛ්‍යාව",
            "පාසලට ඇති දුර",
            "ප්‍රවාහන මාධ්‍ය"
        ],
        mainRows: [
            { id: "pre_school", label: "පෙර පාසල්" },
            { id: "primary_school", label: "ප්‍රාථමික පාසල්" },
            { id: "secondary_school", label: "ද්විතීයික පාසල්" },
            { id: "vocational_training", label: "වෘත්තීය පුහුණු ආයතන" },
            { id: "library_facilities", label: "පුස්තකාල පහසුකම්" }
        ],
        dynamicRow: {
            idPrefix: 'otherEducation',
            placeholder: "වෙනත් (සඳහන් කරන්න)"
        },
        secondaryTable: {
            isTable: true,
            tableColumns: [
                "පාසල් යන වයසේ සිසුන් සංඛ්‍යාව",
                "ගමෙන් බැහැර පිහිටි පාසැල් වල අධ්‍යාපන ලබන සිසුන් සංඛ්‍යාව",
                "පාසල් යාම සදහා කී. මී. 10කට වඩා දුරක් ගමන් කරන සිසුන් සංඛ්‍යාව",
                "පාසැල් අධ්‍යාපනය අතර මග අතහැර දැමූ සිසුන් සංඛ්‍යාව",
                "කවර හෝ අධ්‍යාපන ශිෂ්‍යාධාරයක් හිමි සිසුන් ගණන",
                "අධ්‍යාපන ශිෂ්‍යාධාරයක් ඉල්ලුම් කර ඇති සිසුන් ගණන"
            ]
        }
    },
      "තොරතුරු තාක්ෂණ සේවා": {
        isTable: true,
        tableColumns: [
          "මධ්‍යස්ථානය",
          "භාරකාරීත්වය",
          "සේවා ලබා ගන්නා සාමාජික සංඛ්‍යාව",
          "බාහිර සාමාජික සංඛ්‍යාව",
        ],
      },
      "කුසලතා (Skills)": {
           isTable: true,
            canDeleteRows: true, // Add this flag to enable the delete button
            tableColumns: [
                "සාමාන්‍ය පෙළ සමත් සංඛ්‍යාව",
                "උසස් පෙළ සමත් සංඛ්‍යාව",
                "තාක්ෂණික / වෘත්තීය අධ්‍යාපනයට ඇතුළත් වූ සංඛ්‍යාව",
                "තාක්ෂණික / වෘත්තීය අධ්‍යාපන සුදුසුකම් සපුරා ඇති සංඛ්‍යාව",
                "පසුගිය වසරේ විශ්ව විද්‍යාල අධ්‍යාපනයට ඇතුළත් වූ සිසුන් සංඛ්‍යාව",
                "උසස් අධ්‍යාපනයට හෝ තාක්ෂණික අධ්‍යාපනයට යොමු නොවූ වයස අවුරුදු 18-30 ත් අතර තරුණයින් සංඛ්‍යාව"
            ],
        },
      "ක්‍රීඩා සහ වෙනත් කුසලතා": {
        isTable: true,
        tableColumns: [
          "කුසලතාවය (ක්‍රීඩා සංස්කෘතික කලා වෙනත්)",
          "දිස්ත්‍රික් මට්ටමෙන්  ලද ජයග්‍රහණ සංඛ්‍යාව",
          "පළාත් මට්ටමෙන් ලද ජයග්‍රහණ සංඛ්‍යාව",
          "ජාතික මට්ටමෙන් ලද ජයග්‍රහණ සංඛ්‍යාව",
          "ජාත්‍යන්තර මට්ටමෙන් ලද ජයග්‍රහණ සංඛ්‍යාව",
          "අනුග්‍රහය සහිත සංඛ්‍යාව",
          "අනුග්‍රහය අවශ්‍ය සංඛ්‍යාව",
        ],
      },
    },
    "රැකවරණය (Protection)": {
      "රැකවරණය අවශ්‍ය පුද්ගලයන්": {
        isTable: true,
        canDeleteRows: true,
       tableColumns: [
            "දෙමාපියන් අහිමි දරුවන් සිටින පවුල් සංඛ්‍යාව",
            "පියා අහිමි දරුවන් සිටින පවුල් සංඛ්‍යාව",
            "මව අහිමි දරුවන් සිටින පවුල් සංඛ්‍යාව",
            "ආන්තික පවුල් සංඛ්‍යාව",
            "ආබාධ සහිත පුද්ගලයන් සංඛ්‍යාව (ස්ත්‍රී)",
            "ආබාධ සහිත පුද්ගලයන් සංඛ්‍යාව (පුරුෂ)",
            "රැකවරණයක් නොමැති වැඩිහිටියන් සංඛ්‍යාව (අවු. 70 වැඩි) (ස්ත්‍රී)",
            "රැකවරණයක් නොමැති වැඩිහිටියන් සංඛ්‍යාව (අවු. 70 වැඩි) (පුරුෂ)",
            "ආධාර අවශ්‍ය ආබාධිත හා විශේෂ අවශ්‍යතා සහිත පුද්ගලයින් සංඛ්‍යාව (ස්ත්‍රී)",
            "ආධාර අවශ්‍ය ආබාධිත හා විශේෂ අවශ්‍යතා සහිත පුද්ගලයින් සංඛ්‍යාව (පුරුෂ)",
        ],
    },
      "විශේෂිත රෝගාබාධ": {
        isTable: true,
        tableColumns: ["රෝගී තත්වය", "කාන්තා", "පිරිමි"],
      },
      "සමාජ ආරක්ෂණය සහ සංහිඳියාව": {
        isTable: true,
        tableColumns: [
          "ප්‍රජා මධ්‍යස්ථානය",
          "වසම තුළ පිහිටි සංඛ්‍යාව",
          "භාවිතා කරන්නන්",
          "ආසන්නම දුර (කි.මි.)",
          "පහසුකම් ප්‍රමාණවත්ද?",
        ],
      },
      "විරැකියාව (Unemployment)": {
        isTable: true,
        tableColumns: [
          "විරැකියා කාණ්ඩය",
          "සිංහල (කාන්තා)",
          "සිංහල (පිරිමි)",
          "දෙමළ (කාන්තා)",
          "දෙමළ (පිරිමි)",
          "මුස්ලිම් (කාන්තා)",
          "මුස්ලිම් (පිරිමි)",
          "වෙනත් (කාන්තා)",
          "වෙනත් (පිරිමි)",
        ],
      },
      "රජයේ සහන යෝජනා ක්‍රම": {
        isTable: true,
        tableColumns: [
          "වැඩසටහන",
          "දැනට ප්‍රතිලාභ ලබන සංඛ්‍යාව",
          "ලැබීමට අපේක්ෂිත සංඛ්‍යාව",
        ],
      },
      "රාජ්‍ය නොවන සංවිධාන": {
        isTable: true,
        tableColumns: [
          "ආයතනය",
          "ක්‍රියාත්මක වැඩසටහන",
          "ආවරණය වන ප්‍රදේශය",
          "ආවරණය වන පවුල් සංඛ්‍යාව",
        ],
      },
      "වන සතුන්ගෙන් සිදුවන තර්ජන": {
        problems: [
          {
            id: "elephantDeaths",
            label: "පසුගිය වර්ෂයේ වන අලින් විසින් පහර දී මිය ගිය සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "elephantHouseDamage",
            label:
              "පසුගිය වර්ෂයේ වන අලින් විසින් පහර දී විනාශ වූ නිවාස සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "elephantAttacks",
            label: "පසුගිය වර්ෂයේ වාර්තා වූ සමස්ත වන අලි පහර දීම් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "crocodileAttacks",
            label: "පසුගිය වර්ෂයේ වාර්තා වූ කිඹුලන් පහරදීම් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "leopardAttacks",
            label:
              "පසුගිය වර්ෂයේ වාර්තා වූ දිවියන් ඇතුළු වන සිවුපාවුන්ගේ පහරදීම් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "snakeBites",
            label: "පසු ගිය වර්ෂයේ වාර්තා වූ සර්පයින් දෂ්ඨ කිරීම් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "otherAnimalThreats",
            label: "වෙනත් (සඳහන් කරන්න)",
            type: "text_with_number",
          },
        ],
      },
      "මිනිස් ක්‍රියාකාරකම් හේතුවෙන් සතුන්ට වන හානි": {
        problems: [
          {
            id: "elephantDeathsByHuman",
            label:
              "පසුගිය වර්ෂයේ මිනිස් ක්‍රියාකාරකම් හේතුවෙන් මියගිය වන අලින් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "elephantInjuriesByHuman",
            label:
              "පසුගිය වර්ෂයේ මිනිස් ක්‍රියාකාරකම් හේතුවෙන් තුවාල වූ වන අලි සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "crocodileDeathsByHuman",
            label:
              "පසුගිය වර්ෂයේ මිනිස් ක්‍රියාකාරකම් හේතුවෙන් මියගිය කිඹුලන් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "leopardDeathsByHuman",
            label:
              "පසුගිය වර්ෂයේ මිනිස් ක්‍රියාකාරකම් හේතුවෙන් මියගිය දිවියන් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "otherAnimalHarm",
            label: "වෙනත් (සඳහන් කරන්න)",
            type: "text_with_number",
          },
        ],
      },
      "ආපදා අවදානම් කලාප": {
        isTable: true,
        tableColumns: [
          "ආපදා තත්වය",
          "ආපදාවට ලක්වන භුමි ප්‍රමාණය (අක්කර)",
          "ආපදාවට ලක්වෙන පවුල් සංඛ්‍යාව",
        ],
      },
      "ආරක්ෂාව (Security)": {
        problems: [
          {
            id: "murders",
            label: "පසුගිය වර්ෂයේ සිදු වූ මිනීමැරුම් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "thefts",
            label: "පසුගිය වර්ෂයේ සිදු වූ හොරකම් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "childAbuse",
            label: "පසු ගිය වර්ෂයේ සිදු වූ ළමා අපචාර සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "crimesAgainstWomen",
            label: "පසුගිය වර්ෂයේ සිදු වූ කාන්තාවන්ට එරෙහි අපරාධ සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "domesticViolence",
            label: "පසුගිය වර්ෂයේ වාර්තා වූ ගෘහස්ථ හිංසන සිද්ධි සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "suicides",
            label: "පසුගිය වසරේ වාර්තා වූ සිය දිවි හානි කර ගැනීම් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "convictedFamilies",
            label: "පවුලේ සාමාජිකයෙක් අධිකරණයෙන් වරදකරු වී ඇති පවුල් සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "illegalSubstances",
            label:
              "නීතිවිරෝධී මත්ද්‍රව්‍ය සහ මත්පැන් නිෂ්පාදන/අලෙවි ස්ථාන පවති ද?",
            type: "yesno",
          },
          {
            id: "cyberCrime",
            label:
              "පසුගිය වසර තුළ ප්‍රදේශය තුළ සිදු වූ අන්තර්ජාල හා සම්බන්ධ අපරාධ (Cyber Crime) සංඛ්‍යාව",
            type: "number",
          },
          {
            id: "otherSecurityIssues",
            label: "වෙනත් (සඳහන් කරන්න)",
            type: "text_with_number",
          },
        ],
      },
    },
    "නිශ්පාදන ආර්ථිකය (Production Economy)": {
      "සම්ප්‍රදායික කර්මාන්ත": {
        isTable: true,
        tableColumns: [
          "කර්මාන්තයේ නම",
          "කර්මාන්තයේ ස්වභාවය (නිෂ්පාදන වර්ගය)",
          "ලබා දී ඇති රැකියා (කාන්තා)",
          "ලබා දී ඇති රැකියා (පිරිමි)",
        ],
      },
      "අනෙකුත් කර්මාන්ත": {
        isTable: true,
        tableColumns: [
          "කර්මාන්තයේ නම",
          "කර්මාන්තයේ ස්වභාවය (නිෂ්පාදන වර්ගය)",
          "ලබා දී ඇති රැකියා (කාන්තා)",
          "ලබා දී ඇති රැකියා (පිරිමි)",
        ],
      },
      "කර්මාන්ත සඳහා සම්පත් සුලභතාවය": {
        isTable: true,
        tableColumns: [
          "සම්පත් වර්ගය",
          "පැතිරී ඇති භූමි ප්‍රමාණය (අක්කර)",
          "ආශ්‍රිත සෘජු රැකියා (කාන්තා)",
          "ආශ්‍රිත සෘජு රැකියා (පිරිමි)",
        ],
      },
      "නව කර්මාන්ත විභවතා": {
        isTable: true,
        tableColumns: [
          "කර්මාන්තයේ ස්වභාවය",
          "දිය හැකි රැකියා අවස්ථා (කාන්තා)",
          "දිය හැකි රැකියා අවස්ථා (පිරිමි)",
        ],
      },
      "සංචාරක ආකර්ෂණීය ස්ථාන": {
        isTable: true,
        tableColumns: [
          "ආකර්ෂණීය ස්ථානය",
          "දෛනිකව පැමිණෙන සංචාරකයින්",
          "ආශ්‍රිත රැකියා නියුක්තිකයන්",
          "සංවර්ධනය විය යුතුද? (ඔව්/නැත)",
        ],
      },
    },
  };

const DevelopmentForm = () => {
  // State for form inputs and selections
  const [district, setDistrict] = useState("");
  const [divisionalSec, setDivisionalSec] = useState("");
  const [gnDivision, setGnDivision] = useState("");
  const [cdcVdpId, setCdcVdpId] = useState("");
  const [sector, setSector] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");
  const [subSubSubCategory, setSubSubSubCategory] = useState("");

  const [districts, setDistricts] = useState([]);
  const [dsDivisions, setDsDivisions] = useState([]);
  const [gnDivisions, setGnDivisions] = useState([]);

  const [problems, setProblems] = useState({});
  const [tableData, setTableData] = useState([]);
  const [proposals, setProposals] = useState([
    { proposal: "", cost: "", agency: "" },
  ]);

  const [secondaryTableData, setSecondaryTableData] = useState([]);

  // Load initial district data from the imported JSON
  useEffect(() => {
    const allDistricts = provincialDataJson[0]?.districts || [];
    setDistricts(allDistricts);
  }, []);

  // Event handlers for cascading dropdowns
  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.target.value;
    setDistrict(selectedDistrictName);
    setDivisionalSec("");
    setGnDivision("");
    setDsDivisions([]);
    setGnDivisions([]);

    if (selectedDistrictName) {
      const selectedDistrictData = districts.find(
        (d) => d.district.trim() === selectedDistrictName
      );
      if (selectedDistrictData) {
        setDsDivisions(selectedDistrictData.ds_divisions);
      }
    }
  };

  const handleDivisionalSecChange = (e) => {
    const selectedDsName = e.target.value;
    setDivisionalSec(selectedDsName);
    setGnDivision("");
    setGnDivisions([]);

    if (selectedDsName) {
      const selectedDsData = dsDivisions.find(
        (ds) => ds.ds_division_name.trim() === selectedDsName
      );
      if (selectedDsData) {
        setGnDivisions(selectedDsData.gn_divisions);
      }
    }
  };



  const getFinalSection = () => {
    if (!sector || !subCategory) return null;
    try {
      const level1 = sectors[sector];
      const level2 = level1 ? level1[subCategory] : null;
      if (!level2 || level2.problems || level2.isTable || level2.isFixedRowTable || level2.isHybridTable) return level2;
      if (!subSubCategory) return null;
      const level3 = level2[subSubCategory];
      if (!level3 || level3.problems || level3.isTable || level3.isFixedRowTable || level3.isHybridTable) return level3;
      if (!subSubSubCategory) return null;
      const level4 = level3[subSubSubCategory];
      return level4 || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const currentSection = getFinalSection();

  useEffect(() => {
        if (currentSection) {
            if (currentSection.isTable) {
                 setTableData([]);
            } else if (currentSection.isHybridTable) {
                const initialFixedData = {};
                currentSection.mainRows.forEach(row => {
                    initialFixedData[row.id] = {};
                    currentSection.tableColumns.forEach(col => {
                       initialFixedData[row.id][col] = "";
                    });
                });

               // Conditionally create the dynamic part
                const dynamicPart = currentSection.dynamicRow 
                    ? [{ id: `${currentSection.dynamicRow.idPrefix}_${Date.now()}`, description: "", ...currentSection.tableColumns.reduce((acc, col) => ({...acc, [col]: ''}), {}) }]
                    : [];
                setTableData({ fixed: initialFixedData, dynamic: dynamicPart });
             }
             // Handle secondary table initialization
            if (currentSection.secondaryTable) {
                setSecondaryTableData([]);
            }
         } else  {
              setTableData(null);
              setSecondaryTableData([]); // Also clear on deselect
        }
    }, [currentSection]);

  const resetSelections = (level) => {
    if (level <= 1) setSubCategory("");
    if (level <= 2) setSubSubCategory("");
    if (level <= 3) setSubSubSubCategory("");
    setProblems({});
    setTableData([]);
  };

  const handleProblemChange = (id, value) => {
    setProblems((prev) => ({ ...prev, [id]: value }));
  };

  const handleTextWithNumberChange = (id, field, value) => {
    setProblems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const deleteTableRow = (rowIndex) => {
        setTableData(prev => prev.filter((_, index) => index !== rowIndex));
    };

  const addSecondaryTableRow = () => {
        if (!currentSection?.secondaryTable) return;
        const newRow = currentSection.secondaryTable.tableColumns.reduce((acc, col) => ({ ...acc, [col]: "" }),{});
        setSecondaryTableData(prev => [...prev, newRow]);
    };

    const handleSecondaryTableChange = (rowIndex, col, value) => {
        setSecondaryTableData(prev => {
            const newData = [...prev];
            newData[rowIndex][col] = value;
            return newData;
        });
    };

  const addTableRow = () => {
    if (!currentSection || !currentSection.tableColumns) return;
    const newRow = currentSection.tableColumns.reduce(
      (acc, col) => ({ ...acc, [col]: "" }),
      {}
    );
    setTableData((prev) => [...prev, newRow]);
  };

  const handleTableChange = (rowIndex, col, value) => {
      setTableData((prev) => {
          const newData = [...prev];
          newData[rowIndex][col] = value;
          return newData;
      });
  };

const handleHybridTableChange = (type, id, column, value) => {
        setTableData(prev => {
            const newData = { ...prev };
            if (type === 'fixed') {
                newData.fixed[id] = { ...newData.fixed[id], [column]: value };
            } else if (type === 'dynamic') {
                const rowIndex = newData.dynamic.findIndex(row => row.id === id);
                if (rowIndex > -1) {
                    const newDynamicRows = [...newData.dynamic];
                    newDynamicRows[rowIndex] = { ...newDynamicRows[rowIndex], [column]: value };
                    newData.dynamic = newDynamicRows;
                }
            }
            return newData;
        });
    };

    const addOtherRow = () => {
        const newRow = { id: `${currentSection.dynamicRow.idPrefix}_${Date.now()}`, description: "" };
        currentSection.tableColumns.forEach(col => {
            newRow[col] = "";
        });
        setTableData(prev => ({
            ...prev,
            dynamic: [...prev.dynamic, newRow]
        }));
    };

    const deleteOtherRow = (id) => {
        setTableData(prev => ({
            ...prev,
            dynamic: prev.dynamic.filter(row => row.id !== id)
        }));
    };

  const addProposal = () => {
    setProposals((prev) => [...prev, { proposal: "", cost: "", agency: "" }]);
  };

  const handleProposalChange = (index, field, value) => {
    setProposals((prev) => {
      const newProposals = [...prev];
      newProposals[index][field] = value;
      return newProposals;
    });
  };

  const deleteProposal = (index) => {
    setProposals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      district,
      divisionalSec,
      gnDivision,
      cdcVdpId,
      selection: { sector, subCategory, subSubCategory, subSubSubCategory },
      data: (currentSection?.isTable || currentSection?.isFixedRowTable) ? tableData : problems,
      proposals,
    };
    console.log("Form Submitted Data:", JSON.stringify(formData, null, 2));
    alert("Form data has been logged to the console.");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">ඒකාබද්ධ ග්‍රාම සංවර්ධන සැලැස්ම</h2>
      <form onSubmit={handleSubmit}>
        <LocationSelector
          district={district}
          divisionalSec={divisionalSec}
          gnDivision={gnDivision}
          cdcVdpId={cdcVdpId}
          districts={districts}
          dsDivisions={dsDivisions}
          gnDivisions={gnDivisions}
          handleDistrictChange={handleDistrictChange}
          handleDivisionalSecChange={handleDivisionalSecChange}
          setGnDivision={setGnDivision}
          setCdcVdpId={setCdcVdpId}
        />

        <SectorSelector
          sectors={sectors}
          sector={sector}
          setSector={setSector}
          subCategory={subCategory}
          setSubCategory={setSubCategory}
          subSubCategory={subSubCategory}
          setSubSubCategory={setSubSubCategory}
          subSubSubCategory={subSubSubCategory}
          setSubSubSubCategory={setSubSubSubCategory}
          resetSelections={resetSelections}
        />

        <DynamicContent
          currentSection={currentSection}
          problems={problems}
          handleProblemChange={handleProblemChange}
          handleTextWithNumberChange={handleTextWithNumberChange}
          tableData={tableData}
          handleTableChange={handleTableChange}
                    handleHybridTableChange={handleHybridTableChange}
          addTableRow={addTableRow}
          deleteTableRow={deleteTableRow}
          addOtherRow={addOtherRow}
            deleteOtherRow={deleteOtherRow}
            // Add new props for the secondary table
                    secondaryTableData={secondaryTableData}
                    addSecondaryTableRow={addSecondaryTableRow}
                    handleSecondaryTableChange={handleSecondaryTableChange}
        />

        <Proposals
          proposals={proposals}
          handleProposalChange={handleProposalChange}
          addProposal={addProposal}
          deleteProposal={deleteProposal}
        />

        <button type="submit" className="btn btn-primary btn-submit">
          ඉදිරිපත් කරන්න
        </button>
      </form>
    </div>
  );
};

export default DevelopmentForm;
