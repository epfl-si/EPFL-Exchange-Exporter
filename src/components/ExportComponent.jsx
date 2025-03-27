"use client";

import { useEffect, useRef, useState } from "react";

import ExportExtSelect from "./ExportExtSelect";
import ExportDownloadButton from "./ExportDownloadButton";
import ExportNameFileSetter from "./ExportNameFileSetter";
import ExportDoubleDatePicker from "./ExportDoubleDatePicker";
import SearchBar from "./SearchBar";
import Loading from "./Loading";
import AlertBox from "./AlertBox";
import LinkGeneratorButton from "./LinkGeneratorButton"

import downloadFile from "@/services/exportManager"
import disconnect from "@/services/disconnect";

import { useSearchParams, useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

export default ({authSession}) => {

  const [userSearch, setUserSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [exportExt, setExportExt] = useState("");
  const [exportExtCheckName, setExportExtCheckName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [isCheck, setIsCheck] = useState(false);

  const [alertState, setAlertState] = useState("check");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertLabel, setAlertLabel] = useState("Téléchargement réussi");
  const [alertButtonValue, setAlertButtonValue] = useState("OK");

  const [isClicked, setIsClicked] = useState(false);

  const [dateIsRequired, setDateIsRequired] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const downloadButtonRef = useRef()
  const formRef = useRef()

  const t = useTranslations("Form");

  useEffect(()=>{
    let startDate = searchParams.get("start");
    let endDate = searchParams.get("end");
    let room = searchParams.get("room");
    let filename = searchParams.get("filename");
    let extension = searchParams.get("extension");

    if (startDate && endDate){
      setDateIsRequired(false);
    }


    if (startDate){
      startDate = new Date(startDate)
      let day = ("0" + startDate.getDate()).slice(-2);
      let month = ("0" + (startDate.getMonth() + 1)).slice(-2);

      let start = startDate.getFullYear()+"-"+(month)+"-"+(day) ;
      setStartDate(start);
    }

    if (endDate){
      endDate = new Date(endDate)
      let day = ("0" + endDate.getDate()).slice(-2);
      let month = ("0" + (endDate.getMonth() + 1)).slice(-2);

      let end = endDate.getFullYear()+"-"+(month)+"-"+(day) ;
      setEndDate(end);
    }

    if (room){
      setUserSearch(room);
    }

    if (filename){
      setFileName(filename);
    }

    if (extension){
      setExportExt(extension);
      setExportExtCheckName(extension);
    }

  }, [])

  useEffect(()=>{
    if (userSearch && fileName && exportExt && exportExtCheckName && startDate && endDate && searchParams.has("download")){
      formRef.current.requestSubmit();
      setDateIsRequired(true);
    }
  },[userSearch && fileName && exportExt && exportExtCheckName && startDate && endDate])

  return (
    <>
      <form
      ref={formRef}
      onSubmit={async(e) => {
        console.log("bloup");
        e.preventDefault();

        setLoadingLabel("Vérification des données");
        setIsLoading(true);

        let downloadData = await downloadFile(
          {
            authSession : authSession,
            filename : fileName,
            extension : exportExt,
            startDate : startDate,
            endDate : endDate,
            userSearch : userSearch,
            setLoadingLabel : setLoadingLabel,
            setIsLoading : setIsLoading
          }
        );

        console.log(downloadData);

        if (downloadData.state.isExpired){
          setAlertState(downloadData.alertbox.state);
          setAlertTitle(downloadData.alertbox.title);
          setAlertLabel(downloadData.alertbox.label);
          setAlertButtonValue(downloadData.alertbox.button.value);

          setIsCheck(true);
          // disconnect();
        }

        if (downloadData.state.rewrite){
          setIsClicked(false);
          setIsLoading(false);
          setExportExt("");
          setExportExtCheckName("");
          setFileName("");
          setStartDate(null);
          setEndDate(null);
          setUserSearch("");
          router.replace('/', undefined, { shallow: true });
        }

        if (downloadData.alertbox.state && !downloadData.state.isExpired){
          setAlertState(downloadData.alertbox.state);
          setAlertTitle(downloadData.alertbox.title);
          setAlertLabel(downloadData.alertbox.label);
          setAlertButtonValue(downloadData.alertbox.button.value);

          setIsCheck(true);
        }
      }}
      className="flex flex-col m-auto bg-[#EEEEEE] p-10 gap-10 rounded-xl">

        <div className="flex justify-center">
          <SearchBar value={userSearch} setter={setUserSearch} placeholder={t("room")} user={authSession?.user?.email || ""} authSession={authSession} required={true}/>
        </div>

        <div>
        {/* <div className="flex gap-3 justify-between"> */}
          {/* <ExportDatePicker value={startDate} setter={setStartDate} label={t("start")} required={true}/>
          <ExportDatePicker value={endDate} setter={setEndDate} label={t("end")} required={true}/> */}
          <ExportDoubleDatePicker
          startValue={startDate}
          startSetter={setStartDate}
          endValue={endDate}
          endSetter={setEndDate}
          label={t("period")}
          required={dateIsRequired}/>
        </div>

        <div>
          <ExportNameFileSetter value={fileName} setter={setFileName} required={true} placeholder={t("filename")} />
          <datalist id="filenameDataList">
            <option
            value={[userSearch.replace("@epfl.ch", "").split(".").map((x)=> x = x.slice(0, 3)).join(""), startDate, endDate].join("_")}>
              {[userSearch.replace("@epfl.ch", "").split(".").map((x)=> x = x.slice(0, 3)).join(""), startDate, endDate].join("_")}
            </option>
          </datalist>
        </div>

        <div>
          <ExportExtSelect value={exportExt} setter={setExportExt} required={true} isLastMissing={userSearch && startDate && endDate && fileName && isClicked} checkName={{value : exportExtCheckName, setter : setExportExtCheckName}}/>
        </div>

        {/* <div className="flex">
          <ExportNameFileSetter value={fileName} setter={setFileName} required={true}/>
        </div>

        <div className="flex">
          <button className="bg-[#FF0000] hover:bg-[#B51F1F] active:bg-[#891818] text-white font-bold py-2 px-4 rounded inline-flex items-center" type="submit">
            <span>✔️</span>
            <span>CSV</span>
          </button>
          <button className="bg-[#FF0000] hover:bg-[#B51F1F] active:bg-[#891818] text-white font-bold py-2 px-4 rounded inline-flex items-center" type="submit">
            <img alt="Csv icons created by mpanicon - Flaticon" src={csvIcons.src} className="w-10"/>
            <span>JSON</span>
          </button>
        </div> */}

        <div className="flex justify-center">
          <ExportDownloadButton ref={downloadButtonRef} isLastMissing={userSearch && startDate && endDate && fileName} isClickedSetter={setIsClicked} label={t("download")}/>
        </div>
      </form>
      {
        isLoading ?
        <Loading label={loadingLabel}/>
        :
        <></>
      }
      {
        isCheck ?
        <AlertBox data={
          {
            state: alertState,
            title: alertTitle,
            label: alertLabel,
            button:
            {
              value: alertButtonValue,
              setter : setIsCheck
            }
          }
        }/>
        // true ?
        // <AlertBox data={
        //   {
        //     state: alertState,
        //     title: alertTitle,
        //     label: alertLabel,
        //     button:
        //     {
        //       value: alertButtonValue,
        //       setter : setIsCheck
        //     }
        //   }
        // }/>
        :
        <></>
      }
    </>
  );
};