import Head from "next/head";
import Image from "next/image";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/Fi";
import { TbNumbers } from "react-icons/Tb";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface TextDetail {
  [key: string]: number;
}
export default function Home() {
  const { theme, setTheme } = useTheme();
  const [searchText, setSearchText] = useState<string>("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const [letterLength, setLetterLength] = useState<Number>(0);

  const [letterLengthNoSpace, setLetterLengthNoSpace] = useState<Number>(0);
  const [paragraphLength, setParagraphLength] = useState<number>(0);
  const [text, setText] = useState("");
  const [mounted, setMounted] = useState(false);

  const [textDetail, setTextDetail] = useState<TextDetail>({});
  const [wordCount, setWordCount] = useState(0);
  const [wordUniqueCount, setWordUniqueCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    if (e.clipboardData) {
      const pastedText = e.clipboardData.getData("text/plain");
      setText(text + pastedText);
      setWordCount(
        text + pastedText !== ""
          ? (text + pastedText).trim().split(/\s+/).length
          : 0
      );
    } else {
      return;
    }
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let textArray = text
      .trim()
      .split(/\s+/)
      .filter((letter) => letter !== "");
    const textDet: TextDetail = {};

    for (const word of textArray) {
      textDet[word] = (textDet[word] || 0) + 1;
    }
    setWordUniqueCount(Object.entries(textDet).length);

    const sortedTextDetail = Object.entries(textDet)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj: any, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    setTextDetail(sortedTextDetail);
    setReadingTime(
      text && Math.floor(wordCount / 238) === 0
        ? 1
        : Math.floor(wordCount / 238)
    );
    setLetterLength(text.split("").length);
    setLetterLengthNoSpace(
      text.split("").filter((letter) => letter !== " ").length
    );
    setParagraphLength(text ? text.trim().split("\n").length : 0);
  }, [text]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setWordCount(
      e.target.value !== "" ? e.target.value.trim().split(/\s+/).length : 0
    );
  };
  function highlightText() {
    const regex = new RegExp(searchText, "gi");
    const regex2 = new RegExp("\n");
    let highlightedText = text.replace(regex2, `<br>`);
    let reformattedText = highlightedText.replace(
      regex,
      `<mark class="rounded-md bg-yellow-300 px-1">$&</mark>`
    );
    return <div dangerouslySetInnerHTML={{ __html: reformattedText }} />;
  }
  if (!mounted) {
    return null;
  }
  return (
    <>
      <Head>
        <title>Simple Word Counter</title>
        <meta
          name="description"
          content="Simple Word Counter for any kind of text."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://simplewordcounter.com/" />
      </Head>
      <div
        className={` dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700  flex justify-center items-center py-4 transition-colors duration-200 ease-in-out`}
      >
        <div
          className="flex justify-between items-center w-full p-3 md:p-0"
          style={{ maxWidth: "1100px" }}
        >
          <div className=" flex gap-2 items-center text-lg  p-2 border border-gray-200 dark:text-teal-300 text-black rounded-lg dark:border-gray-700 ">
            <TbNumbers className="text-yellow-400" />
            Simple Word Counter
          </div>
          <div
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="cursor-pointer p-3 bg-yellow-500 rounded-lg"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </div>
        </div>
      </div>
      <div className=" absolute bottom-0 left-0 right-0 top-20 bg-gray-50 dark:bg-gray-900 flex justify-center p-2 transition-colors duration-200 ease-in-out ">
        <div className="flex gap-3 " style={{ width: "1100px" }}>
          <div className=" flex flex-col  w-full md:min-w-full">
            <div className="flex mt-5 gap-5 w-full">
              <div className=" gap-3 flex items-center  p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg  ">
                <span className="font-md text-lg">Word Count:</span>
                <span className="text-purple-500 dark:text-teal-300 text-xl">
                  {wordCount ?? 0}
                </span>
              </div>
              <div className=" gap-3 flex items-center  p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg  ">
                <span className="font-md text-lg">Characters:</span>
                <span className="text-purple-500 dark:text-teal-300 text-xl">
                  {letterLength.toString() ?? 0}
                </span>
              </div>
            </div>
            <div className=" flex flex-col md:flex-row gap-3 text-black dark:text-white items-baseline w-full mt-4">
              {searchText ? (
                <div
                  onClick={() => {
                    setSearchText("");
                  }}
                  style={{ height: "400px" }}
                  className="block p-3 w-full md:w-3/4 text-md rounded-lg  dark:bg-gray-800 border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {highlightText()}
                </div>
              ) : (
                <textarea
                  name=""
                  ref={ref}
                  className="p-3 w-full md:w-3/4 text-md dark:bg-gray-800 font-thin  rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-700 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Paste Your Text..."
                  id="textarea-main"
                  style={{ height: "400px" }}
                  value={text}
                  onChange={(e) => handleTextChange(e)}
                  onPaste={(e: any) => {
                    handlePaste(e);
                  }}
                ></textarea>
              )}
              <div className="lg:w-1/4 w-full">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between rounded-lg border dark:border-gray-700 dark:bg-gray-800  py-3 px-3 ">
                    <div>Words</div>
                    <div className="text-center px-2 flex justify-center items-center rounded-lg bg-blue-400">
                      {wordCount.toString()}
                    </div>
                  </div>
                  <div className="flex justify-between rounded-lg border dark:border-gray-700 dark:bg-gray-800  py-3 px-3 ">
                    <div>Unique Words</div>
                    <div className="text-center px-2 flex justify-center items-center rounded-lg bg-blue-400">
                      {wordUniqueCount.toString()}
                    </div>
                  </div>
                  <div className="flex justify-between rounded-lg border dark:border-gray-700 dark:bg-gray-800 py-3 px-3 ">
                    <div>Characters</div>
                    <div className="text-center px-2 flex justify-center items-center rounded-lg bg-blue-400">
                      {letterLength.toString()}
                    </div>
                  </div>
                  <div className="flex justify-between rounded-lg border dark:border-gray-700 dark:bg-gray-800 py-3 px-3 ">
                    <div>Characters (no space)</div>
                    <div className="text-center  px-2 flex justify-center items-center rounded-lg bg-blue-400">
                      {letterLengthNoSpace.toString()}
                    </div>
                  </div>
                  <div className="flex justify-between rounded-lg border dark:border-gray-700 dark:bg-gray-800  py-3 px-3 ">
                    <div>Paragraph</div>
                    <div className="text-center px-2 flex justify-center items-center rounded-lg bg-blue-400">
                      {paragraphLength.toString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border dark:border-gray-700 dark:bg-gray-800 py-3 px-3 ">
                    <div>Reading Time</div>
                    <div className="text-center px-2 flex justify-center items-center rounded-lg bg-blue-400">
                      {readingTime.toString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 text-lg  text-yellow-400">Top Keywords</div>
            <div className="flex flex-wrap gap-3 w-full mt-3 overflow-hidden ">
              {Object.entries(textDetail)
                .slice(0, 12)
                .map(([word, frequency]) => (
                  <div
                    key={word}
                    onClick={() => setSearchText(word)}
                    className="flex gap-3 appearance-none max-w-full  cursor-pointer border border-gray-200 dark:border-gray-700 font-normal text-sm inline-flex items-center justify-center py-2 px-3 rounded-full whitespace-no  hover:bg-gray-200 focus:outline-none focus:shadow-outline hover:text-black border  border-gray-700"
                  >
                    <span>{word}</span>
                    <span className="flex justfiy-center items-center px-2 bg-blue-400 rounded-lg">
                      {" "}
                      {frequency}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
