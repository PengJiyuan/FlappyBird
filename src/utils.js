export function isPC() { 
  const userAgentInfo = navigator.userAgent; 
  const Agents = ['Android', 'iPhone', 'iPad', 'Mobile']; 
  let flag = true; 
  for (let v = 0; v < Agents.length; v++) { 
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    } 
  } 
  return flag; 
}

export function addEvent(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler);
  } else {
    element['on' + type] = handler;
  }
}

export function removeEvent(element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler);
  } else {
    element['on' + type] = null;
  }
}

export function getEventPosition(ev) {
  let x, y;
  if (ev.touches) {
	  x = ev.touches[0].pageX;
    y = ev.touches[0].pageY;
  } else if (ev.layerX || ev.layerX === 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX === 0) {
    x = ev.offsetX;
    y = ev.offsetY;
  }
  return { x, y };
}

//获得start到end的随机数
export function getRandom(start, end) {
	return Math.round(Math.random() * (end - start) + start);
}
