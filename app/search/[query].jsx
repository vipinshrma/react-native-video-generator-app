import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, RefreshControl, SafeAreaView, Text, View } from 'react-native'
import EmptyState from '../../components/EmptyState'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import VideoCard from '../../components/VideoCard'
import { images } from '../../constants'
import useAppWrite from '../../hooks/useAppWrite'
import { getAllLatestPost, getAllPost, searchPost } from '../../lib/appwrite'
function Search() {
  const { query } = useLocalSearchParams()
  const [refreshing, setRefreshing] = useState(false)
  const { isLoading, refetch, data } = useAppWrite(()=>searchPost(query))


  // const onRefresh = async () => {
  //   refetch()
  // }

  useEffect(() => {
    refetch()

  }, [query])
  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={data}
        keyExtractor={(({ $id }) => $id)}
        renderItem={(({ item }) => {
          return <VideoCard video={item} />
        })}
        ListHeaderComponent={() => {
          return (
            <View className='my-6 px-4'>
                  <Text className='font-pmedium text-sm text-gray-100'>Search Results</Text>
                  <Text className='text-2xl font-psemibold text-white'>{query}</Text>
                  <View className='mt-6 mb-8'>
                  <SearchInput
                    inititalQuery={query}
                    placeholder={'Search for a video topic'}
                  />
                  </View>
                 
            </View>
          )
        }}
        ListEmptyComponent={() => {
          return <EmptyState
            title='No Videos found'
            subtitle='No Videos found for this search query'
          />

        }}
      />
    </SafeAreaView>
  )
}

export default Search