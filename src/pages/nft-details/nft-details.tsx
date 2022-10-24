import React from 'react'
import { useParams } from 'react-router-dom'

type NftDetailsProps = unknown

export const NftDetails: React.FC<NftDetailsProps> = () => {
  const { did } = useParams()

  return <>NftDetails: {did}</>
}
