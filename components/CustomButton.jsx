import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default function CustomButton({title='',handlePress,textStyles,containerStyles,isLoading}) {
    return (
        <TouchableOpacity onPress={handlePress} disabled={isLoading} className={` bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}>
            <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
        </TouchableOpacity>

    )
}
