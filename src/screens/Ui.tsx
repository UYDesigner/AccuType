import { useEffect, useState } from "react";

import { BsToggle2Off, BsToggle2On } from "react-icons/bs";

import { IoSpeedometer } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { FaEquals } from "react-icons/fa";

export const Ui = () => {
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [flag, setFlag] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [netSpeed, setNetSpeed] = useState(0);
  const [darkMode, seteDarkMode] = useState(true);


  useEffect(() => {
    if (flag && intervalId === null) {
      const id = window.setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000)
      setIntervalId(id);
    }

  }, [flag])

  useEffect(() => {
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, []);



  useEffect(() => {
    fetchParagraph()
  }, []);


  const fetchParagraph = async () => {
    const res = await fetch("https://baconipsum.com/api/?type=all-meat&paras=1&format=text");
    // console.log("fetchparagraph response", res)
    const data = (await (await (res.text())).substring(0, 300))
    console.log("fetchparagraph response.json", data)
    setText(data);
  }


  const handleReset = () => {
    setInputText("");
    setWpm(0);
    setAccuracy(0);
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null)

    }
    setTimeElapsed(0)
    setFlag(false)
    setShowResult(false);
    fetchParagraph();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const calculateResult = (): void => {
    const correctChars = inputText.split("").filter((char, i) => char === text[i]).length;
    const totalTypedChars = inputText.length;
    const accuracyVal = totalTypedChars === 0 ? 0 : (correctChars / totalTypedChars) * 100;
    const wpmVal = (totalTypedChars / 5) / (timeElapsed / 60 || 1)
    setAccuracy(accuracyVal);
    setWpm(wpmVal)
    const netVal = wpmVal * (accuracyVal / 100);

    setNetSpeed(Number(netVal.toFixed(2)));
    setShowResult(true);
  }





  const toggleDarkMode = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");

    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      seteDarkMode(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      seteDarkMode(true);
    }
  };



  // Load saved theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
    // Whenever the user explicitly chooses light mode
    localStorage.theme = "light";
    // Whenever the user explicitly chooses dark mode
    localStorage.theme = "dark";
    // Whenever the user explicitly chooses to respect the OS preference
    localStorage.removeItem("theme");
  }, []);

  return (
    <div>
      {
        showResult ?
          <>
            <div className="fixed inset-0 bg-gray-400
                dark:from-[#000003] dark:to-[#01022b] dark:bg-gradient-to-br flex items-center justify-center z-50 transition-colors duration-500">

              <div className="bg-white dark:bg-gray-800 rounded-xl py-6 px-6 w-100 text-center shadow-xl">
                <div className="flex flex-row items-center mb-4 justify-center gap-4 jus p-2 space-y-2">
                  <IoSpeedometer className=" text-5xl text-blue-900 dark:text-white" />
                  <h2 className="text-3xl font-bold text-blue-900 dark:text-white">
                    Your Test Score
                  </h2>
                </div>

                <div className=" flex items-center justify-between">
                  {/* <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Time: {formatTime(timeElapsed)}</p> */}
                  <div className="flex flex-col gap-2">
                    <div className=" w-20 h-20 p-3 rounded-[100%] grid border-2 border-[#00d5ff]  place-items-center  ">
                      <p className="font-semibold text-2xl text-gray-600 dark:text-white">{Math.round(wpm)}</p>
                      <p className="text-sm text-gray-700 dark:text-white ">WPM</p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-white ">Typing Speed</p>
                  </div>

                  <ImCross className="text-3xl text-gray-400" />
                  <div className="flex flex-col gap-2">
                    <div className=" w-20 h-20 py-4 rounded-[100%] grid border-2 border-[#00d5ff]  place-items-center  ">
                      <p className="font-semibold text-[16px] text-gray-600 dark:text-white">{accuracy.toFixed(2)}%</p>
                      <p className="text-sm text-gray-700 dark:text-white">Accu </p>

                    </div>
                    <p className="text-sm text-gray-700 dark:text-white ">Accuracy</p>
                  </div>
                  <FaEquals className="text-3xl text-gray-400" />
                  <div className="flex flex-col gap-2">
                    <div className=" w-20 h-20 p-3 rounded-[100%] grid border-2 border-[#15c39a]  place-items-center  ">
                      <p className="font-semibold text-2xl text-gray-600 dark:text-white">{netSpeed}</p>
                      <p className="text-sm text-gray-700 dark:text-white ">Speed</p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-white ">Net Speed</p>
                  </div>

                </div>

                <div className="flex justify-center items-center   mt-9">
                  {/* <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Time: {formatTime(timeElapsed)}</p> */}

                  <button
                    onClick={handleReset}
                    className=" w-full px-6 py-2 bg-blue-900 hover:bg-blue-700 dark:bg-[#15c39a] dark:hover:bg-[#059271] text-xl cursor-pointer text-white border font-semibold rounded-lg"
                  >
                    Retake Test
                  </button>
                </div>
              </div>
            </div>
          </> :


          <div className="min-h-screen transition-colors duration-300 flex items-center justify-center p-4 
                bg-gray-400
                dark:from-[#000003] dark:to-[#01022b] dark:bg-gradient-to-br">

            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 space-y-6 text-gray-700 dark:text-gray-100">

              {/* ====== Header: App Name + Theme Toggle ====== */}
              <div className="flex justify-between items-center">
                <h1 className="cursor-pointer text-4xl font-bold text-blue-900 dark:text-[#ffffff]">AccuType</h1>


                <div
                  onClick={() => {
                    toggleDarkMode()
                    console.log("theme changed")


                  }}
                  className="transition-all duration-1000 ease-in-out
                  
"
                >
                  {darkMode ? <BsToggle2On
                    className="text-4xl cursor-pointer text-gray-400 transition-all duration-900 ease-in-out"

                  />
                    :
                    <BsToggle2Off
                      className="text-4xl cursor-pointer text-blue-900 transition-all duration-900 ease-in-out"
                    />
                  }

                </div>

              </div>

              {/* ====== Timer + Instructions ====== */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-300">Time: {formatTime(timeElapsed)}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 sm:mt-0">
                  Type the paragraph below as accurately and quickly as you can.
                </p>
              </div>

              {/* ====== Typing Area ====== */}
              <div className="relative w-full sm:h-[180px] font-mono leading-relaxed h-[380px] border rounded-md border-gray-300 dark:border-gray-700">

                {/* Display Text */}
                <div className="absolute inset-0 whitespace-pre-wrap break-words pointer-events-none p-4 text-base">
                  {[...text].map((char, i) => {
                    const typedChar = inputText[i];
                    let className = "";

                    if (typedChar == null) {
                      className = "text-gray-500 dark:text-gray-400";
                    } else if (typedChar === char) {
                      className = "text-green-400";
                    } else {
                      className = "text-red-500";
                    }

                    return (
                      <span key={i} className={className}>
                        {char}
                      </span>
                    );
                  })}
                </div>

                {/* Transparent Input Area */}
                <textarea
                  className="absolute inset-0 w-full h-full p-4 resize-none bg-transparent text-transparent caret-transparent focus:outline-none border border-gray-300 dark:border-gray-700 focus:border-blue-700   dark:focus:border-blue-400"
                  value={inputText}
                  onChange={(e) => {
                    const newText = e.target.value;
                    setInputText(newText);

                    // Start the timer if typing begins
                    if (!flag && newText.length === 1) {
                      setFlag(true);
                    }

                    // Stop timer and calculate result if done
                    if (newText.length === text.length) {
                      if (intervalId !== null) {
                        clearInterval(intervalId);
                        setIntervalId(null);
                      }
                      setFlag(false);

                      calculateResult();
                    }
                  }}

                  spellCheck={false}

                />
              </div>

              {/* ====== Results and Reset ====== */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                {/* <div className="text-sm">WPM: <span className="font-semibold">{wpm}</span></div>
          <div className="text-sm">Accuracy: <span className="font-semibold">{accuracy}%</span></div> */}

                <button
                  onClick={handleReset}
                  className="dark:bg-blue-700 bg-blue-900 hover:bg-blue-700 dark:hover:bg-blue-900 text-white px-10 py-2 rounded-lg text-lg font-medium cursor-pointer"
                >
                  Restart
                </button>
              </div>

            </div>
          </div>
      }
    </div>

  );

};
