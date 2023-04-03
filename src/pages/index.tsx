function HomePage() {
  const handleLoginClick = () => {
    window.location.href = `https://github.com/login/oauth/authorize?scope=public_repo&client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`
  }

  return (
    <>
      <button onClick={handleLoginClick}>
        登入 GitHub
      </button>
    </>
  )
}

export default HomePage