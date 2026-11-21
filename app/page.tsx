"use client";

import { useState } from "react";

type Modal = "exam" | "homework" | "assistant" | "profile" | "edit" | null;

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
  const [question,setQuestion] = useState("");
  const [notice,setNotice] = useState("");

  const open = (m:Modal) => { setNotice(""); setModal(m); };
  const submit = () => {
    if (!topic.trim() && modal !== "profile" && modal !== "edit") { setNotice("Escribe primero el tema o la pregunta para continuar."); return; }
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
      <div className="modalhead"><h2>{modal==="exam"?"Crear un examen":modal==="homework"?"Ayuda con tus deberes":modal==="assistant"?"Asistente de IA":modal==="profile"?"Mi perfil de creador":"Administrar Mi Aula IA"}</h2><button className="close" onClick={()=>setModal(null)}>×</button></div>
      {modal==="exam" && <><p className="sub">Prepara un cuestionario a partir del tema que estés estudiando.</p><div className="field"><label>Tema o contenido</label><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Ej. La célula, sus partes y funciones..."/></div><div className="field"><label>Nivel educativo</label><select value={level} onChange={e=>setLevel(e.target.value)}><option>Primaria</option><option>ESO</option><option>Bachillerato</option><option>Universidad</option></select></div><div className="field"><label>Número de preguntas</label><input type="number" min="1" max="50" value={count} onChange={e=>setCount(e.target.value)}/></div><button className="primary" onClick={submit}>Preparar examen →</button></>}
      {modal==="homework" && <><p className="sub">Cuéntame qué ejercicio necesitas resolver. Después añadiremos la opción de subir una foto o escanear la hoja.</p><div className="field"><label>Enunciado del ejercicio</label><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Pega aquí el enunciado o describe el ejercicio..."/></div><button className="primary" onClick={submit}>Pedir explicación →</button><div className="notice" style={{marginTop:14}}>La explicación estará pensada para que entiendas cómo se hace, no solo para darte la respuesta.</div></>}
      {modal==="assistant" && <><div className="chatbubble">¡Hola! Soy el asistente de Mi Aula IA. Puedo ayudarte a estudiar, explicar temas, preparar preguntas y proponerte mejoras para el aula.</div><div className="field"><label>¿Qué quieres preguntarme?</label><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Escribe tu duda o una mejora que quieras proponer..."/></div><button className="primary" onClick={()=>{setTopic(question);submit()}}>Enviar consulta →</button><div className="notice" style={{marginTop:14}}>La conexión con el modelo de IA se activará al configurar de forma segura el servicio de IA.</div></>}
      {modal==="profile" && <><p className="sub">Tu cuenta tendrá el rol de creador y administrador principal del proyecto.</p><div className="field"><label>Nombre que se mostrará</label><input value={creator} onChange={e=>setCreator(e.target.value)} /></div><div className="notice">Rol: Creador principal · Permisos de administración. Los cambios de configuración y publicación estarán bajo tu control.</div><button className="primary" style={{marginTop:16}} onClick={()=>setModal(null)}>Guardar perfil</button></>}
      {modal==="edit" && <><p className="sub">Gestiona las mejoras del aula y decide qué cambios se aplican.</p><div className="notice"><strong>Tu control, siempre.</strong><br/>El asistente podrá proponer cambios en textos, herramientas y organización. Antes de aplicar cambios importantes, te pedirá confirmación.</div><div className="field"><label>Describe el cambio que quieres</label><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ej. Añade una sección de ciencias con fichas de estudio..."/></div><button className="primary" onClick={()=>{setTopic(question);submit()}}>Preparar propuesta de cambio</button></>}
      {notice && <div className="notice" style={{marginTop:14}}>{notice}</div>}
    </section></div>}
  </div>;
}