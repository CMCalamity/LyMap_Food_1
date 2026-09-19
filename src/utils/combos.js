const KEY='lymap_combos'
export const DEFAULT_COMBOS=[
 {id:'combo-1',name:'Combo Sáng Nhẹ',description:'1 chai sữa + 1 phần ăn vặt',price:30000,image:'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80',enabled:true,badge:'Tiết kiệm'},
 {id:'combo-2',name:'Combo 2 Người',description:'2 chai sữa + 2 topping',price:55000,image:'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',enabled:true,badge:'Bán chạy'},
]
export function getCombos(){try{const raw=localStorage.getItem(KEY);if(raw)return JSON.parse(raw);localStorage.setItem(KEY,JSON.stringify(DEFAULT_COMBOS));return DEFAULT_COMBOS}catch{return DEFAULT_COMBOS}}
export function saveCombos(list){localStorage.setItem(KEY,JSON.stringify(list));window.dispatchEvent(new Event('lymap-combos'));return list}
