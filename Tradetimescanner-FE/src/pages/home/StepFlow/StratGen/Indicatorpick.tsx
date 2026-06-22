import { useState, useEffect } from "react";
import { useStateSetter } from "../../../../hooks/statehooks/UseStateSettersHook";
import { indicators } from "../../../../constants/data/data";
import { NavigateBtns } from "../../../../components/generic/NavigateBtns";
import { CiStar } from "react-icons/ci";
import { RxStarFilled } from "react-icons/rx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/generic/accordion";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdAutoMode } from "react-icons/md";
import { useResponsive } from "../../../../hooks/useResponsive";

export default ({ nextStep, previousStep, setpostdata }: any) => {
  const { setNextAction, setPrevAction } = useStateSetter();
  const { isMobile, isTablet } = useResponsive();
  const [favorites, setFavourites] = useState<any[]>([]);
  const [selectedindi, setselectedindi] = useState<any[]>([]);
  const [activetab, setactivetab] = useState("");

  useEffect(() => {
    setNextAction(nextStep);
    setPrevAction(previousStep);
  }, []);

  const tabs = ["Favourite", "All"];

  useEffect(() => {
    setactivetab(tabs[1]);
  }, []);

  useEffect(() => {
    favorites.length > 0 &&
      localStorage.setItem("favindi", JSON.stringify(favorites));
    console.log("Setitem", favorites);
  }, [favorites]);
  const [cat_, setcat] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string>("");

  useEffect(() => {
    console.log(selectedindi);
  }, [selectedindi]);

  // Update selectedCategory when accordion opens
  useEffect(() => {
    if (openAccordion !== "") {
      const accordionIndex = parseInt(openAccordion.replace("item-", ""));
      const categories = [
        "Options Strategy",
        "Forex Strategy",
        "Crypto Strategy",
        "Gold Strategy (XAUUSD)",
        "Indices Strategy",
      ];

      const selectedCategory = categories[accordionIndex] || "";

      setpostdata((prev: any) => ({
        ...prev,
        selectedCategory: selectedCategory,
        catkey: accordionIndex,
      }));
    }
  }, [openAccordion, setpostdata]);

  useEffect(() => {
    const retrievedArray = JSON.parse(localStorage.getItem("favindi") ?? "[]");
    setFavourites(retrievedArray);
    console.log("getitem", localStorage.getItem("favindi"));
  }, []);

  const TabItem = ({ item }: any) => (
    <div
      onClick={() => {
        setactivetab(item);
      }}
      className={`${activetab == item ? " bg-gray-800" : "bg-blue-300"} ${
        isMobile ? "px-3 py-1 text-xs" : "px-4 py-1 text-xs"
      } rounded cursor-pointer text-white transition-colors`}
    >
      {item}
    </div>
  );

  const Indicatoritem = ({ catkey, item, isrecommend }: any) => (
    <div
      className={`
        inline-block cursor-pointer m-1 rounded transition-colors
        ${
          isMobile
            ? "px-2 py-1 text-xs max-w-[85vw]"
            : "px-2 py-1 text-sm max-w-[80vw]"
        }
        ${
          selectedindi?.includes(item)
            ? item.code == 555 || item.code == 777
              ? "bg-green-400 text-white"
              : "bg-primary text-white"
            : "bg-blue-100 text-gray-700"
        }
        ${item.code == 555 || item.code == 777 ? "bg-green-100" : ""}
        overflow-x-auto truncate
      `}
    >
      {isrecommend ? (
        <MdAutoMode size={isMobile ? 16 : 20} className="inline" />
      ) : !favorites.some((gg: any) => gg.code == item.code) ? (
        <CiStar
          onClick={() => {
            setFavourites((prev: any) => prev.concat([item]));
          }}
          size={isMobile ? 16 : 20}
          className="inline"
        />
      ) : (
        <RxStarFilled
          onClick={() => {
            setFavourites((prev: any) =>
              prev.filter((kl: any) => kl.code != item.code)
            );
          }}
          size={isMobile ? 16 : 20}
          className="inline text-orange-300"
        />
      )}

      <span
        onClick={() => {
          setselectedindi((prev: any) => {
            setpostdata((prev: any) => {
              return { ...prev, catkey: catkey };
            });
            if (selectedindi?.includes(item as never)) {
              return prev.filter((kl: any) => kl != item);
            } else {
              return prev.concat([item]);
            }
          });
        }}
        className="ml-1"
      >
        {item.name}
      </span>
    </div>
  );

  const [isrec, setisrec] = useState(false);

  const RECIndicatoritem = ({ catkey, item, cat }: any) => (
    <div
      className={`bg-blue-100 max-w-[80vw] overflow-x-scroll inline-block cursor-pointer m-1 rounded px-2 py-1 ${
        selectedindi.some((kll: any) => kll.code == item.code)
          ? "bg-green-400 text-white"
          : "bg-green-100"
      } text-sm text-gray-700 truncate `}
    >
      {<MdAutoMode size={20} className="inline  " />}

      <span
        onClick={() => {
          setselectedindi((prev: any) => {
            setpostdata((prev: any) => {
              return { ...prev, catkey: catkey };
            });

            setcat(cat);
            if (selectedindi.some((kll: any) => kll.code == item.code)) {
              setisrec(false);
              return prev.filter((kl: any) => kl.code != item.code);
            } else {
              setisrec(true);
              return prev.concat([item]);
            }
          });
        }}
      >
        {item.name}
      </span>
    </div>
  );

  return (
    <div
      className={` overflow-x-hidden 
      relative self-center place-self-center w-full p-2
      ${isMobile ? "min-h-[400px]" : "min-h-[500px] md:!w-[600px] md:mt-6"}
    `}
    >
      {/* Responsive Header */}
      <div
        className={`
        flex gap-4 py-2 border-t-2 rounded px-2
        ${
          isMobile
            ? "flex-col space-y-2"
            : "flex-col md:flex-row md:items-center"
        }
      `}
      >
        <div className={isMobile ? "space-y-2" : ""}>
          <p
            className={`
            text-gray-500 font-[400] my-2
            ${
              isMobile
                ? "text-xs text-center"
                : "text-xs md:text-sm md:text-center"
            }
          `}
          >
            Select 1- 3 indicator items
          </p>
          <div className="flex gap-2 justify-center">
            {tabs.map((kj: any, index) => (
              <TabItem key={index} item={kj} />
            ))}
          </div>
        </div>
        <p
          className={`
          text-gray-500 font-[400] text-center
          ${isMobile ? "text-xs" : "text-xs md:text-sm"}
        `}
        >
          Selected ({selectedindi.length})
        </p>
      </div>

      {/* Responsive Content Area */}
      <div
        className={`
        flex flex-col justify-between  rounded overflow-y-scroll relative
        ${
          isMobile
            ? "w-[90vw] h-full p-2 pb-16"
            : "w-[90vw] md:w-full h-[400px] p-3 pb-20 md:pb-1"
        }
      `}
      >
        {activetab == "All" ? (
          <Accordion
            type="single"
            collapsible
            value={openAccordion}
            onValueChange={setOpenAccordion}
          >
            {indicators.map((ik: any, key) => (
              <AccordionItem
                style={{ marginBottom: 20 }}
                key={key}
                value={`item-${key}`}
              >
                <AccordionTrigger
                  className={`
                  text-blue-900 
                  ${isMobile ? "text-sm py-2" : "text-base"}
                `}
                >
                  <p>
                    <BiSolidCategoryAlt className="inline mr-1" />
                    {isMobile && ik.categoryname.length > 20
                      ? ik.categoryname.substring(0, 20) + "..."
                      : ik.categoryname}
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  {ik.categoryname == "Options Strategy" ? (
                    <RECIndicatoritem
                      cat={ik.categoryname}
                      catkey={key}
                      item={{ name: "Recommend for me", code: 555 }}
                    />
                  ) : (
                    <RECIndicatoritem
                      cat={ik.categoryname}
                      catkey={key}
                      item={{ name: "Recommend for me", code: 777 }}
                    />
                  )}
                  <div
                    className={`
                    gap-1 
                    ${isMobile ? "w-full" : "w-[80%]"}
                    ${isrec && ik.categoryname == cat_ && " blur-[3px]"}
                  `}
                  >
                    {ik.items.map((il: any, index: number) => (
                      <Indicatoritem key={index} catkey={key} item={il} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="gap-1">
            {favorites.map((il: any, index: number) => (
              <Indicatoritem key={index} item={il} />
            ))}
          </div>
        )}

        {/* Responsive Navigation Buttons */}
        <div
          className={` place-self-end mr-4 md:mr-0
          ${
            isMobile
              ? "fixed bottom-4 w-[50vw] left-4 right-4 z-10"
              : "fixed bottom-5"
          }
        `}
        >
          <NavigateBtns
            shownext
            actionPrev={() => {
              previousStep();
            }}
            nextCondition={selectedindi.length <= 3 && selectedindi.length > 0}
            actionNext={() => {
              setpostdata((prev: any) => {
                return { ...prev, indicators: selectedindi };
              });
              nextStep();
            }}
          />
        </div>
      </div>
    </div>
  );
};
