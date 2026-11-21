"use client";

import { useEffect, useState } from "react";

type Modal = "exam" | "homework" | "assistant" | "profile" | "edit" | "settings" | "review" | null;

const features = [
  { key:"exam" as const, icon:"✎", title:"Crear un examen", desc:"Genera preguntas tipo test o de desarrollo a partir de tus apuntes.", color:"#eef0ff" },
  { key:"homework" as const, icon:"▤", title:"Resolver deberes", desc:"Sube un ejercicio y recibe una explicación paso a paso.", color:"#e8f8f2" },
  { key:"assistant" as const, icon:"✦", title:"Hablar con la IA", desc:"Pregunta tus dudas y estudia con un asistente que te acompaña.", color:"#fff3e8" }
];

export default function Home() {
  const [modal,setModal] = useState<Modal>(null);
  const [creator,setCreator] = useState("Creador de Mi Aula IA");
  const [topic,setTopic] = useState("");
  const [level,setLevel] = useState("ESO");
  const [count,setCount] = useState("10");
  const [examTitle,setExamTitle] = useState("");
  const [noTitle,setNoTitle] = useState(false);
  const [examBackground,setExamBackground] = useState("blanco");
  const [rating,setRating] = useState(5);
  const [reviewText,setReviewText] = useState("");
  const [question,setQuestion] = useState("");
  const [notice,setNotice] = useState("");
  const [photos,setPhotos] = useState<File[]>([]);
  const [examPhotos,setExamPhotos] = useState<File[]>([]);
  const [assistantPhotos,setAssistantPhotos] = useState<File[]>([]);
  const [recognizedText,setRecognizedText] = useState("");
  const [isReading,setIsReading] = useState(false);
  const [examText,setExamText] = useState("");
  const [assistantText,setAssistantText] = useState("");
  const [photoLimit,setPhotoLimit] = useState(10);
  const [limitDraft,setLimitDraft] = useState("10");

  useEffect(() => {
    const saved = window.localStorage.getItem("miaula-photo-limit");
    if (saved) { const parsed = Number(saved); if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 1000) { setPhotoLimit(parsed); setLimitDraft(String(parsed)); } }
  }, []);

  const open = (m:Modal) => { setNotice(""); if (m === "homework") setPhotos([]); setModal(m); };
  const exportExamPdf = () => {
    const title = noTitle ? "" : (examTitle.trim() || "Examen");
    const colors: Record<string,string> = { blanco:"#ffffff", azul:"#eaf1ff", verde:"#eaf8ef", rosa:"#fff0f5", crema:"#fff8e8" };
    const content = `<html><head><title>${title || "Examen"}</title><style>body{font-family:Arial,sans-serif;padding:40px;background:${colors[examBackground] || "#fff"};color:#17233b}h1{margin-bottom:24px}p{line-height:1.7}.line{border-bottom:1px solid #9aa4b5;margin:28px 0}</style></head><body>${title ? `<h1>${title}</h1>` : ""}<p><b>Asignatura o tema:</b> ${topic.replaceAll("<","&lt;").replaceAll(">","&gt;")}</p><p><b>Nivel:</b> ${level} · <b>Preguntas previstas:</b> ${count}</p><div class="line"></div><p>Espacio para responder. El examen con preguntas generadas por IA estará disponible cuando conectemos el generador.</p><div class="line"></div><script>window.onload=()=>window.print()<\/script></body></html>`;
    const win = window.open("", "_blank");
    if (!win) { setNotice("Permite las ventanas emergentes para crear el PDF."); return; }
    win.document.open(); win.document.write(content); win.document.close();
  };
  const shareExam = () => {
    const text = `Mi examen de Mi Aula IA: ${noTitle ? "" : (examTitle || "Examen")}. Tema: ${topic}. Nivel: ${level}. Preguntas: ${count}.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };
  const recognizeImages = async (files: File[], onText: (value: string) => void) => {
    if (!files.length) { setNotice("Añade al menos una foto."); return; }
    setIsReading(true); setNotice("Leyendo las imágenes…"); onText("");
    let worker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | undefined;
    try {
      const { createWorker } = await import("tesseract.js");\n      worker = await createWorker("spa");
      const parts: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setNotice(`Leyendo foto ${i + 1} de ${files.length}…`);
        const result = await worker.recognize(files[i]);
        if (result.data.text.trim()) parts.push(`FOTO ${i + 1}\\n${result.data.text.trim()}`);\n      }
      const text = parts.join("\\n\\n"); onText(text);
      setNotice(text ? "Lectura terminada. Revisa el texto reconocido." : "No se ha reconocido texto. Prueba con fotos más nítidas.");\n    } catch { setNotice("No se ha podido leer alguna imagen. Comprueba tu conexión e inténtalo de nuevo."); }
    finally { if (worker) await worker.terminate(); setIsReading(false); }\n  };\n
  const readPhotos = async () => {
    if (!photos.length) { setNotice("Añade al menos una foto para poder leerla."); return; }
    setIsReading(true); setNotice("Leyendo las imágenes…"); setRecognizedText("");
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("spa");
      const parts: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        setNotice(`Leyendo foto ${i + 1} de ${photos.length}…`);
        const result = await worker.recognize(photos[i]);
        if (result.data.text.trim()) parts.push(`FOTO ${i + 1}\\n${result.data.text.trim()}`);
      }
      await worker.terminate();
      const text = parts.join("\\n\\n");
      setRecognizedText(text);
      setNotice(text ? "Lectura terminada. Revisa el texto reconocido y corrige cualquier error." : "No se ha podido reconocer texto. Prueba con fotos más nítidas y bien iluminadas.");
    } catch (error) {
      setNotice("No se ha podido iniciar la lectura de imágenes. Comprueba tu conexión e inténtalo de nuevo.");
    } finally { setIsReading(false); }
  };\n
  const submit = () => {
    const source = modal === "assistant" ? `${question}\n${assistantText}` : modal === "edit" ? question : modal === "exam" ? `${topic}\n${examText}` : topic;
    if (!source.trim() && modal !== "profile" && !(modal === "homework" && photos.length > 0)) { setNotice("Escribe el enunciado o añade al menos una foto para continuar."); return; }
    setNotice("¡Perfecto! Esta pantalla ya está preparada. En el siguiente paso conectaremos la IA para generar el contenido real y guardarlo en tu espacio.");
  };

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brandmark">✦</div><span className="brandname">Mi Aula IA</span></div>
      <div><div className="navlabel">MENÚ PRINCIPAL</div><nav className="nav">
        <button className="active"><span className="navicon">⌂</span><span className="navtext">Inicio</span></button>
        <button onClick={()=>open("exam")}><span className="navicon">✎</span><span className="navtext">Exámenes</span></button>
        <button onClick={()=>open("homework")}><span className="navicon">▤</span><span className="navtext">Mis deberes</span></button>
        <button onClick={()=>open("assistant")}><span className="navicon">✧</span><span className="navtext">Asistente IA</span></button>
      </nav></div>
      <div><div className="navlabel">TU ESPACIO</div><nav className="nav">
        <button onClick={()=>open("profile")}><span className="navicon">♙</span><span className="navtext">Mi perfil</span></button>
        <button onClick={()=>open("edit")}><span className="navicon">⚙</span><span className="navtext">Administrar aula</span></button>
        <button onClick={()=>{setLimitDraft(String(photoLimit));open("settings")}}><span className="navicon">☷</span><span className="navtext">Ajustes</span></button>
        <button onClick={()=>open("review")}><span className="navicon">☆</span><span className="navtext">Dejar una reseña</span></button>
      </nav></div>
      <div className="sidebar-bottom"><div className="creator-mini"><div className="avatar">{creator.trim().charAt(0).toUpperCase() || "C"}</div><div className="profiletext"><strong>{creator}</strong><small>✦ Creador · Administrador</small></div></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><div><div className="eyebrow">TU ESPACIO DE APRENDIZAJE</div><h1>¡Hola! Vamos a aprender ✨</h1><div className="sub">Todo lo que necesitas para estudiar, en un solo lugar.</div></div><div className="top-actions"><button className="iconbtn" aria-label="Perfil" onClick={()=>open("profile")}>♙</button><button className="primary" onClick={()=>open("assistant")}>✦ Preguntar a la IA</button></div></header>

      <section className="hero"><div><div className="eyebrow" style={{color:"#dce2ff"}}>BIENVENIDO A MI AULA IA</div><h2>Aprende a tu ritmo. Llega más lejos.</h2><p>Crea exámenes con tus temas, entiende los deberes y resuelve tus dudas con ayuda de la inteligencia artificial.</p></div><button className="primary" onClick={()=>open("exam")}>Crear mi primer examen →</button></section>

      <div className="section-head"><h2>¿Qué quieres hacer hoy?</h2><span>Elige una herramienta para empezar</span></div>
      <section className="grid3">{features.map(f=><button className="feature" key={f.key} onClick={()=>open(f.key)}><span className="symbol" style={{background:f.color}}>{f.icon}</span><strong>{f.title}</strong><small>{f.desc}</small></button>)}</section>

      <div className="section-head"><h2>Tu espacio de trabajo</h2><span>Panel personal</span></div>
      <section className="two-col">
        <div className="panel"><h3>Actividad reciente</h3><p>Cuando empieces a estudiar, aquí encontrarás tus últimos trabajos.</p>
          <div className="activity"><span className="symbol">✎</span><div><strong>Exámenes y cuestionarios</strong><small>Guarda tus pruebas y revisa tus resultados</small></div></div>
          <div className="activity"><span className="symbol">▤</span><div><strong>Deberes y ejercicios</strong><small>Organiza tus tareas y explicaciones</small></div></div>
          <div className="activity"><span className="symbol">✦</span><div><strong>Conversaciones con la IA</strong><small>Retoma tus dudas cuando quieras</small></div></div>
        </div>
        <div className="panel"><h3>Tu perfil de creador</h3><p>Este proyecto tiene un espacio especial para ti como fundador y administrador principal.</p><div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0"}}><div className="avatar" style={{width:48,height:48,fontSize:18}}>{creator.charAt(0).toUpperCase()}</div><div><strong style={{fontSize:13,display:"block"}}>{creator}</strong><span className="pill">Creador principal</span></div></div><button className="primary" onClick={()=>open("profile")}>Editar mi perfil</button></div>
      </section>
      <div className="footer-note">Mi Aula IA · Un proyecto educativo creado contigo y mejorado con IA.</div>
    </main>

    {modal && <div className="modal-back" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null)}}><section className="modal">
      <div className="modalhead"><h2>{modal==="exam"?"Crear un examen":modal==="homework"?"Ayuda con tus deberes":modal==="assistant"?"Asistente de IA":modal==="profile"?"Mi perfil de creador":modal==="settings"?"Ajustes":modal==="review"?"Valora Mi Aula IA":"Administrar Mi Aula IA"}</h2><button className="close" onClick={()=>setModal(null)}>×</button></div>
      {modal==="exam" && <><p className="sub">Prepara un cuestionario a partir del tema que estés estudiando.</p><div className="field"><label><input type="checkbox" checked={noTitle} onChange={e=>setNoTitle(e.target.checked)} /> Crear el examen sin título</label></div>{!noTitle && <div className="field"><label>Título del examen (opcional)</label><input value={examTitle} onChange={e=>setExamTitle(e.target.value)} placeholder="Ej. Examen de Ciencias" /></div>}<div className="field"><label>Fondo del examen</label><select value={examBackground} onChange={e=>setExamBackground(e.target.value)}><option value="blanco">Blanco</option><option value="azul">Azul claro</option><option value="verde">Verde claro</option><option value="rosa">Rosa claro</option><option value="crema">Crema</option></select></div><div className="field"><label>Fotos de tus apuntes (opcional)</label><input type="file" accept="image/*" multiple onChange={e=>{setExamPhotos(current=>[...current,...Array.from(e.target.files ?? [])]);e.currentTarget.value="";}}/><small style={{color:"#748098"}}>Puedes seleccionar varias páginas o añadir más fotos después.</small>{examPhotos.length>0 && <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:8,marginTop:10}}>{examPhotos.map((file,i)=><div key={i}><img src={URL.createObjectURL(file)} alt={`Apunte ${i+1}`} style={{width:"100%",height:85,objectFit:"cover",borderRadius:8}}/><button type="button" className="secondary" onClick={()=>setExamPhotos(current=>current.filter((_,n)=>n!==i))}>Quitar</button></div>)}</div>}<button type="button" className="secondary" disabled={isReading || !examPhotos.length} onClick={()=>recognizeImages(examPhotos,setExamText)}>{isReading?"Leyendo…":"Leer fotos de apuntes"}</button>{examText && <textarea rows={5} value={examText} onChange={e=>setExamText(e.target.value)} aria-label="Texto reconocido de apuntes"/>}</div><div className="field"><label>Tema o contenido</label><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Ej. La célula, sus partes y funciones..."/></div><div className="field"><label>Nivel educativo</label><select value={level} onChange={e=>setLevel(e.target.value)}><option>Primaria</option><option>ESO</option><option>Bachillerato</option><option>Universidad</option></select></div><div className="field"><label>Número de preguntas</label><input type="number" min="1" max="50" value={count} onChange={e=>setCount(e.target.value)}/></div><button className="primary" onClick={submit}>Preparar examen →</button><div className="notice" style={{marginTop:14}}>También puedes preparar una hoja PDF o compartir los datos del examen:</div><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}><button type="button" className="primary" onClick={exportExamPdf}>Crear PDF / Imprimir</button><button type="button" className="primary" onClick={shareExam}>Compartir por WhatsApp</button><button type="button" className="secondary" onClick={()=>{if(navigator.share)navigator.share({title:examTitle||"Examen Mi Aula IA",text:`${topic} · ${level} · ${count} preguntas`}).catch(()=>{});else setNotice("La opción de compartir no está disponible en este navegador. Puedes usar WhatsApp.");}}>Otros destinos</button></div></>}
      {modal==="homework" && <><p className="sub">Escribe el ejercicio o adjunta todas las fotos que necesites: puedes seleccionar muchas a la vez y añadir más en otra selección.</p><div className="field"><label>Enunciado del ejercicio (opcional si adjuntas fotos)</label><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Pega aquí el enunciado o describe el ejercicio..."/></div><div className="field"><label>Fotos del ejercicio</label><input type="file" accept="image/*" multiple onChange={e=>{const added=Array.from(e.target.files ?? []);setPhotos(current=>{const remaining=Math.max(0,photoLimit-current.length);const accepted=added.slice(0,remaining);if(added.length>remaining)setNotice(`Has alcanzado el límite de ${photoLimit} fotos por ejercicio. Puedes cambiarlo en Ajustes.`);else setNotice("");return [...current,...accepted];});e.currentTarget.value="";}}/><small style={{color:"#748098"}}>Puedes añadir fotos en varias tandas. Límite actual: {photoLimit} por ejercicio.</small></div>{photos.length>0 && <div className="notice" style={{marginBottom:14}}><strong>{photos.length} de {photoLimit} foto(s) seleccionada(s)</strong><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:10,marginTop:12}}>{photos.map((photo,i)=><div key={i}><img src={URL.createObjectURL(photo)} alt={`Vista previa ${i+1}`} style={{width:"100%",height:100,objectFit:"cover",borderRadius:10}}/><small>{photo.name}</small></div>)}</div><ul style={{margin:"8px 0 0",paddingLeft:18}}>{photos.map((photo,i)=><li key={i} style={{marginTop:4,display:"flex",justifyContent:"space-between",gap:8}}><span>{photo.name}</span><button type="button" onClick={()=>setPhotos(current=>current.filter((_,index)=>index!==i))} aria-label={"Quitar "+photo.name}>Quitar</button></li>)}</ul></div>}<button className="primary" onClick={readPhotos} disabled={isReading}>{isReading ? "Leyendo fotos…" : "Leer texto de las fotos →"}</button>{recognizedText && <div className="field" style={{marginTop:16}}><label>Texto reconocido (puedes corregirlo)</label><textarea rows={10} value={recognizedText} onChange={e=>setRecognizedText(e.target.value)} /><button type="button" className="secondary" onClick={()=>{navigator.clipboard?.writeText(recognizedText);setNotice("Texto copiado.");}}>Copiar texto</button></div>}<div className="notice" style={{marginTop:14}}>La lectura de texto se realiza en el navegador mediante OCR. La explicación automática paso a paso con IA y el guardado de tus ejercicios requieren conectar el servicio de IA y almacenamiento.</div></>}
      {modal==="assistant" && <><div className="chatbubble">¡Hola! Soy el asistente de Mi Aula IA. Puedo ayudarte a estudiar, explicar temas, preparar preguntas y proponerte mejoras para el aula.</div><div className="field"><label>Adjuntar fotos o capturas (opcional)</label><input type="file" accept="image/*" multiple onChange={e=>{setAssistantPhotos(current=>[...current,...Array.from(e.target.files ?? [])]);e.currentTarget.value="";}}/><small style={{color:"#748098"}}>Puedes adjuntar varias imágenes de ejercicios, apuntes o dudas.</small>{assistantPhotos.length>0 && <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:8,marginTop:10}}>{assistantPhotos.map((file,i)=><div key={i}><img src={URL.createObjectURL(file)} alt={`Imagen adjunta ${i+1}`} style={{width:"100%",height:85,objectFit:"cover",borderRadius:8}}/><button type="button" className="secondary" onClick={()=>setAssistantPhotos(current=>current.filter((_,n)=>n!==i))}>Quitar</button></div>)}</div>}<button type="button" className="secondary" disabled={isReading || !assistantPhotos.length} onClick={()=>recognizeImages(assistantPhotos,setAssistantText)}>{isReading?"Leyendo…":"Leer texto de las fotos"}</button>{assistantText && <textarea rows={5} value={assistantText} onChange={e=>setAssistantText(e.target.value)} aria-label="Texto reconocido de imágenes"/>}</div><div className="field"><label>¿Qué quieres preguntarme?</label><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Escribe tu duda o una mejora que quieras proponer..."/></div><button className="primary" onClick={()=>{setTopic(question);submit()}}>Enviar consulta →</button><div className="notice" style={{marginTop:14}}>La conexión con el modelo de IA se activará al configurar de forma segura el servicio de IA.</div></>}
      {modal==="profile" && <><p className="sub">Tu cuenta tendrá el rol de creador y administrador principal del proyecto.</p><div className="field"><label>Nombre que se mostrará</label><input value={creator} onChange={e=>setCreator(e.target.value)} /></div><div className="notice">Rol: Creador principal · Permisos de administración. Los cambios de configuración y publicación estarán bajo tu control.</div><button className="primary" style={{marginTop:16}} onClick={()=>setModal(null)}>Guardar perfil</button></>}
      {modal==="settings" && <><p className="sub">Configura cuántas fotografías se pueden adjuntar a cada ejercicio. El ajuste se guarda en este dispositivo.</p><div className="field"><label>Límite de fotos por ejercicio</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[10,15,20].map(value=><button type="button" className={Number(limitDraft)===value?"primary":"secondary"} key={value} onClick={()=>setLimitDraft(String(value))}>{value}</button>)}</div></div><div className="field"><label>O elige tu propio límite</label><input type="number" min="1" max="1000" step="1" value={limitDraft} onChange={e=>setLimitDraft(e.target.value)} /><small style={{color:"#748098"}}>Puedes elegir entre 1 y 1.000 fotos por ejercicio.</small></div><button className="primary" onClick={()=>{const value=Number(limitDraft);if(!Number.isInteger(value)||value<1||value>1000){setNotice("Introduce un número entero entre 1 y 1.000.");return;}setPhotoLimit(value);window.localStorage.setItem("miaula-photo-limit",String(value));setNotice("Límite guardado correctamente.");}}>Guardar ajustes</button><div className="notice" style={{marginTop:14}}>Límite actual: {photoLimit} fotos por ejercicio. Si ya tienes más fotos seleccionadas que el nuevo límite, no se borrarán automáticamente, pero no podrás añadir más hasta estar por debajo del límite.</div></>}
      {modal==="review" && <><p className="sub">Cuéntanos qué te parece la aplicación. Tu opinión nos ayudará a mejorarla.</p><div className="field"><label>Tu valoración</label><div style={{display:"flex",gap:8}}>{[1,2,3,4,5].map(n=><button key={n} type="button" aria-label={`${n} estrellas`} onClick={()=>setRating(n)} style={{border:0,background:"transparent",fontSize:28,color:n<=rating?"#e6a23c":"#cbd2df"}}>★</button>)}</div></div><div className="field"><label>Tu reseña (opcional)</label><textarea value={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder="¿Qué te gusta? ¿Qué mejorarías?"/></div><button className="primary" onClick={()=>setNotice("¡Gracias por tu valoración! El envío y publicación de reseñas se activarán cuando conectemos el sistema de opiniones.")}>Enviar reseña</button><div className="notice" style={{marginTop:12}}>Por ahora la pantalla recoge tu opinión, pero todavía no la publica ni la envía a una tienda de aplicaciones.</div></>}
      {modal==="edit" && <><p className="sub">Gestiona las mejoras del aula y decide qué cambios se aplican.</p><div className="notice"><strong>Tu control, siempre.</strong><br/>El asistente podrá proponer cambios en textos, herramientas y organización. Antes de aplicar cambios importantes, te pedirá confirmación.</div><div className="field"><label>Describe el cambio que quieres</label><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ej. Añade una sección de ciencias con fichas de estudio..."/></div><button className="primary" onClick={()=>{setTopic(question);submit()}}>Preparar propuesta de cambio</button></>}
      {notice && <div className="notice" style={{marginTop:14}}>{notice}</div>}
    </section></div>}
  </div>;
}