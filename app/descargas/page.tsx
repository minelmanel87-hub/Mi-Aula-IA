import Link from "next/link";
import styles from "./descargas.module.css";

const publishedFiles: Array<{ title: string; kind: string; platform: string; version: string; size: string; href: string }> = [];

export default function DownloadsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← Volver a Mi Aula IA</Link>
        <div className={styles.eyebrow}>CENTRO OFICIAL DE DESCARGAS</div>
        <h1>Todo Mi Aula IA, en un solo lugar.</h1>
        <p>Descarga la aplicación, instala Mi Aula IA en tu móvil o encuentra proyectos educativos publicados por el equipo.</p>
      </header>

      <section className={styles.installGrid} aria-label="Opciones de instalación">
        <article className={styles.installCard}>
          <div className={styles.icon}>▣</div>
          <span className={styles.tag}>ANDROID</span>
          <h2>Aplicación para Android</h2>
          <p>Cuando publiquemos una versión APK firmada, podrás descargarla desde aquí y consultar su versión, tamaño y fecha.</p>
          <div className={styles.status}>Todavía no hay ningún APK publicado.</div>
          <small>Instala únicamente archivos publicados en este centro y comprueba siempre el nombre y la versión.</small>
        </article>
        <article className={styles.installCard}>
          <div className={styles.icon}>◉</div>
          <span className={styles.tag}>IPHONE · IPAD</span>
          <h2>Instalar gratis en iPhone</h2>
          <p>La versión web instalable permite añadir Mi Aula IA a la pantalla de inicio sin pagar una cuenta de App Store.</p>
          <ol className={styles.steps}>
            <li>Abre Mi Aula IA en Safari.</li>
            <li>Pulsa Compartir.</li>
            <li>Elige «Añadir a pantalla de inicio» y confirma.</li>
          </ol>
          <Link href="/" className={styles.action}>Abrir Mi Aula IA →</Link>
        </article>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><div className={styles.eyebrow}>BIBLIOTECA</div><h2>Aplicaciones y proyectos</h2></div>
          <span className={styles.count}>{publishedFiles.length} publicaciones</span>
        </div>
        {publishedFiles.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>↓</div>
            <h3>Aún no hay archivos publicados</h3>
            <p>Cuando el equipo publique APK, herramientas o proyectos educativos, aparecerán aquí con su descripción y datos de versión.</p>
          </div>
        ) : (
          <div className={styles.fileGrid}>
            {publishedFiles.map((file) => (
              <article className={styles.fileCard} key={file.href}>
                <span className={styles.tag}>{file.platform}</span>
                <h3>{file.title}</h3><p>{file.kind}</p>
                <div className={styles.fileMeta}>Versión {file.version} · {file.size}</div>
                <a className={styles.action} href={file.href}>Descargar →</a>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.permissions}>
        <div className={styles.eyebrow}>PUBLICACIÓN Y PERMISOS</div>
        <h2>El creador mantiene el control.</h2>
        <div className={styles.roles}>
          <div><strong>👑 Creador principal</strong><p>Control total: administra colaboradores, concede permisos, revisa y publica versiones.</p></div>
          <div><strong>✦ Colaboradores autorizados</strong><p>Podrán subir o editar archivos únicamente con los permisos que les conceda el creador.</p></div>
          <div><strong>↓ Visitantes</strong><p>Podrán consultar y descargar publicaciones, pero no modificar ni subir archivos.</p></div>
        </div>
        <div className={styles.notice}><strong>Protección de las publicaciones:</strong> el acceso real de colaboradores y las subidas seguras requieren conectar inicio de sesión, almacenamiento privado y reglas de permisos en el servidor. Esta pantalla no concede permisos por sí sola y todavía no acepta subidas.</div>
      </section>

      <footer className={styles.footer}>Mi Aula IA · Centro de descargas oficial</footer>
    </main>
  );
}
