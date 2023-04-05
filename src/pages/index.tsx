import style from '../styles/Home.module.scss'

function HomePage() {
  const handleLoginClick = () => {
    window.location.href = `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`
  }


  return (
    <div className={style.wrapper}>
      <h1 className={style.h1}>GitHub Issue Panel</h1>
      <button onClick={handleLoginClick}>
        登入 GitHub
      </button>
    </div>
  )
}

export default HomePage