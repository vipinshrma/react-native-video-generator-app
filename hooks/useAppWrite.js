import React, { useEffect, useState } from 'react'
import {Alert} from 'react-native'
export default function useAppWrite( fn ) {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = () => {
        setIsLoading(true)
        fn().then(res => {
            setData(res)
        }).catch((err) => {
            Alert.alert('Error', err.message)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const refetch = () => fetchData()
    useEffect(() => {
        fetchData()
    }, [])

    return { data, isLoading, refetch }
}
