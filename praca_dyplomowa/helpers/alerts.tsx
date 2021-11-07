import { Alert } from "react-native"

export const showConfirmAlert = async (title: string, desc: string) => new Promise<boolean>(
    (resolve) => {
        Alert.alert(
            title,
            desc,
            [
                {
                    text: 'No',
                    onPress: () => {
                        resolve(false);
                    }
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        resolve(true);
                    }
                },
            ]
        )
    }
)

export const showInfoAlert = (title: string, desc: string) => {
    Alert.alert(
        title,
        desc,
        [
            {
                text: 'Ok',
            },
        ]
    )
}