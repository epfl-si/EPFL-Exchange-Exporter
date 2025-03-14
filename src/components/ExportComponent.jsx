"use client";

import { useState } from "react";

import ExportExtSelect from "./ExportExtSelect";
import ExportDownloadButton from "./ExportDownloadButton";
import ExportNameFileSetter from "./ExportNameFileSetter";
import ExportDatePicker from "./ExportDatePicker";
import SearchBar from "./SearchBar";
import Loading from "./Loading";

import downloadFile from "@/services/exportManager"
import disconnect from "@/services/disconnect";

import csvIcons from "/public/img/csv.png"

export default ({authSession}) => {

  const [userSearch, setUserSearch] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [exportExt, setExportExt] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");


  return (
    <>
      <form onSubmit={async(e) => {
        e.preventDefault();

        setLoadingLabel("Vérification des données");
        setIsLoading(true);

        let state = await downloadFile(
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

        if (state.isExpired){
          // disconnect();
        }

        else if (state.rewrite){
          setIsLoading(false);
          setExportExt("");
          setFileName("");
          setStartDate("");
          setEndDate("");
          setUserSearch("");
        }
      }}
      className="flex flex-col m-auto bg-[#EEEEEE] p-10 gap-10 rounded-xl">

        <div className="flex justify-center">
          <SearchBar value={userSearch} setter={setUserSearch} placeholder={"Email de salle (WIP)"} user={authSession?.user?.email || ""} required={true}/>
        </div>

        <div className="flex gap-3 justify-between">
          <ExportDatePicker value={startDate} setter={setStartDate} label="Début" required={true}/>
          <ExportDatePicker value={endDate} setter={setEndDate} label="Fin" required={true}/>
        </div>

        <div className="flex">
          <ExportNameFileSetter value={fileName} setter={setFileName} required={true} />
          <ExportExtSelect value={exportExt} setter={setExportExt} required={true}/>
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
          <ExportDownloadButton/>
        </div>

      </form>
      {
        isLoading ?
        <Loading label={loadingLabel}/>
        :
        <></>
      }
    </>
  );
};