import { useEffect } from 'react'
import 'click-spark'

export function ClickSparkEffect() {
  useEffect(() => {
    const spark = document.createElement('click-spark')
    spark.style.setProperty('--click-spark-color', 'var(--primary)')
    document.body.appendChild(spark)

    return () => {
      spark.remove()
    }
  }, [])

  return null
}
