import style from './Search.module.scss'

interface SearchProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Search({ value, onChange }: SearchProps) {

  return (
    <>
      <input value={value} onChange={onChange} placeholder={'search'} className={style.input} />
    </>
  )
}