import { router, usePathname } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";

import { icons } from "../constants";

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  inititalQuery='',
  ...props
}) => {
  const pathName = usePathname();
  const [query,setQuery] = useState(inititalQuery)
  const [showPassword, setShowPassword] = useState(false);

  return (
      <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
        <TextInput
          className="flex-1 text-white font-pregular text-base mt-0.5"
          value={query}
          placeholder={placeholder}
          placeholderTextColor="#CDCDEO"
          onChangeText={(e)=>setQuery(e)}
        />

          <TouchableOpacity onPress={() =>{
            if(!query){
              Alert.alert('Missing query',"Please input something to search results across database" )
              return;
            }
            if(pathName.startsWith('/search')) {
              router.setParams({query})
              return;
            }
            else{
              router.push(`/search/${query}`)
            }

          }}>
            <Image
              source={icons.search}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
    </View>
  );
};

export default SearchInput;