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

import { useSearchParams, useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import dayjs from "dayjs";
import ExportResetButton from "./ExportResetButton";

export default ({authSession}) => {

  const [userSearch, setUserSearch] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [fileName, setFileName] = useState("exportation");
  const [exportExt, setExportExt] = useState("csv");
  const [exportExtCheckName, setExportExtCheckName] = useState("csv");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [isCheck, setIsCheck] = useState(false);

  const [alertState, setAlertState] = useState("check");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertLabel, setAlertLabel] = useState("Téléchargement réussi");
  const [alertButtonValue, setAlertButtonValue] = useState("OK");
  const [downloadError, setDownloadError] = useState("");
  const [downloadErrorName, setDownloadErrorName] = useState("");

  const [isClicked, setIsClicked] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const [dateIsRequired, setDateIsRequired] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const downloadButtonRef = useRef()
  const formRef = useRef()

  const t = useTranslations("Form");

  useEffect(()=>{
    if (userSearch && fileName && exportExt && exportExtCheckName && startDate && endDate && searchParams.has("download")){
      formRef.current.requestSubmit();
      setDateIsRequired(true);
    }
  },[userSearch && fileName && exportExt && exportExtCheckName && startDate && endDate])

  const checkIfWanted = (key)=>{
    switch(key){
        case "room":
            return userSearch;
        case "start":
          return startDate;
        case "end":
            return endDate;
        case "filename":
            return fileName;
        case "extension":
            return exportExt;
    }
    return true;
  }

  const resetData = ()=>{
    router.replace('/', undefined, { shallow: true });
    setIsClicked(false);
    setIsLoading(false);
    setExportExt("");
    setExportExtCheckName("");
    setFileName("");
    setStartDate(null);
    setEndDate(null);
    setUserSearch("");
  }

  useEffect(()=>{
    //define date format
    let startD = startDate != null ? dayjs(startDate).format("YYYY-MM-DD") : startDate;
    let endD = endDate != null ? dayjs(endDate).format("YYYY-MM-DD") : endDate;

    //get filename in params
    let filename = !isReset ? fileName : ""; // Let empty here, because if you don't, at reseting it will write this string instead of reseting.
    setIsReset(false);

    //redefine filename if name doesn't provide
    let fn = `exportation_meetings_${userSearch.split("@")[0]}${startD ? `_from_${startD}` : ""}${endD ? `_to_${endD}` : ""}`;
    setFileName((filename.split("_")[0] == "exportation") && (startDate || endDate || userSearch) ? fn : filename)

    //redefine link
    let data = {
      room: userSearch,
      start: startDate ? startD : startDate,
      end: endDate ? endD : endDate,
      filename: fileName,
      extension: exportExt
    }
    let lk = Object.entries(data).map((entry) => ({[entry[0]] : entry[1]})).filter((x)=> Object.values(x)[0] != "" && Object.values(x)[0] != null  && checkIfWanted(Object.keys(x)[0])).map((x) => `${Object.keys(x)[0]}=${Object.values(x)[0]}`).join("&");
    router.replace(`/${lk ? "?" + lk : ""}`, undefined, { shallow: true });

  },[userSearch, fileName, exportExt, startDate, endDate])

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
      console.log(startDate); //2023-12-30
      console.log([2, 1, 0].map((index) => startDate.split("-")[index]).join("/")); //30/12/2023
      startDate = new Date(startDate)
      setStartDate(startDate);
    }

    if (endDate){
      endDate = new Date(endDate)
      setEndDate(endDate);
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

  return (
    <>
      <form
      ref={formRef}
      onSubmit={async(e) => {
        e.preventDefault();

        setLoadingLabel({label: "loaderCheckData"});
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

        setDownloadError(downloadData.error);
        setDownloadErrorName(downloadData.errorName);

        console.log(downloadData);

        if (downloadData.state.isExpired){
          setAlertState(downloadData.alertbox.state);
          setAlertTitle(downloadData.alertbox.title);
          setAlertLabel(downloadData.alertbox.label);
          setAlertButtonValue(downloadData.alertbox.button.value);

          setIsCheck(true);
        }

        if (downloadData.state.rewrite){
          setIsReset(true);
          resetData();
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
        </div>

        <div>
          <ExportExtSelect value={exportExt} setter={setExportExt} required={true} isLastMissing={userSearch && startDate && endDate && fileName && isClicked} checkName={{value : exportExtCheckName, setter : setExportExtCheckName}}/>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-2">
          <LinkGeneratorButton label={t("linkGenerator")} data={{room: userSearch, start: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "", end: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "", filename: fileName, extension: exportExt}}/>
          <ExportResetButton
          label={t("reset")}
          setter={(val)=>{setIsCheck(true)}}
          setterValue={
            {
              label: t("resetLabel"),
              data: [
                {
                  value : t("resetCancel"),
                  setter : (state)=>{setIsCheck(state); }
                },
                {
                  value : t("resetAccept"),
                  setter : (state)=>{setIsCheck(state); resetData(); setIsReset(true);}
                }
              ]
            }
          }/>
        </div>
        <div className="flex justify-center">
          <ExportDownloadButton ref={downloadButtonRef} isLastMissing={userSearch && startDate && endDate && fileName} isClickedSetter={setIsClicked} label={t("download")}/>
        </div>
      </form>
      {
        isLoading ?
        <Loading label={loadingLabel.nb ? t("loaderNbData", {nb: loadingLabel.nb}) : t("loaderCheckData")}/>
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
            error: downloadError,
            errorName: downloadErrorName,
            button:
            {
              value: alertButtonValue,
              setter : setIsCheck
            }
          }
        }/>
        :
        <></>
      }
    </>
  );
};