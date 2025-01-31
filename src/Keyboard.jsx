import React, { useEffect, useRef, useState } from "react";
import {KeyboardReact} from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

import russian from "simple-keyboard-layouts/build/layouts/russian";
import english from "simple-keyboard-layouts/build/layouts/english";

const LayoutEn = JSON.parse(JSON.stringify(english));
LayoutEn.mergeDisplay = true;
LayoutEn.display = {...LayoutEn.display, '{en}':'EN', '{x}':'X'};
LayoutEn.layout.default[0]+= " {x}";
LayoutEn.layout.shift[0]+= " {x}";
LayoutEn.layout.default[4]+= " {en}";
LayoutEn.layout.shift[4]+= " {en}";

const LayoutRu = JSON.parse(JSON.stringify(russian));
LayoutRu.mergeDisplay = true;
LayoutRu.display = {...LayoutRu.display, '{ru}':'RU', '{x}':'X'};
LayoutRu.layout.default[0]+= " {x}";
LayoutRu.layout.shift[0]+= " {x}";
LayoutRu.layout.default[4]+= " {ru}";
LayoutRu.layout.shift[4]+= " {ru}";

function Keyboard(props) {
  const theme = props.theme;
  const input = props.input;
  const inputName = input && input.id;
  const [layout, setLayout] = useState(LayoutEn);
  const [layoutName, setLayoutName] = useState("default");
  const keyboard = useRef();

  const onKeyPress = button => {
    if(button === '{en}') {
      setLayout(LayoutRu);
    }
    if(button === '{x}') {
      props.onClose && props.onClose();
    }
    if(button === '{ru}') {
      setLayout(LayoutEn);
    }
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
  };

  useEffect(()=>{
    if(!input) return;
    keyboard.current.setInput(input.value);
  },[props.input]);

  return (
    <KeyboardReact
      keyboardRef={r => (keyboard.current = r)}
      onChange={props.onChange}
      inputName={inputName}
      onKeyPress={onKeyPress}
      layoutName={layoutName}
      {...layout}
      theme={`simple-keyboard hg-theme-default hg-layout-default 
        ${theme==="dark"?'invert':''} text-[22px]`
      }
    />
  );
}

export default Keyboard;
