import { StripeProvider, useStripe, CardField, initStripe, isPlatformPaySupported, PlatformPayButton, PlatformPay, confirmPlatformPayPayment } from "@stripe/stripe-react-native";
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Pressable, Text, Keyboard, Linking } from "react-native";
import config from "../../common/config";
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from "@tanstack/react-query";
import UserAPI from "../../api/UserAPI";
import { useToken } from "../../common/store/user";
import RNPickerSelect from 'react-native-picker-select';

export default function StripePayment({ publishableKey = "", client_secret = "", payFailed, payFinish, payment_amount }) {
  console.log(payment_amount);
  const { initPaymentSheet, presentPaymentSheet, confirmPayment } = useStripe();
  const payStatus = useState(false);
  const payInfo = useState();
  const [selectCards, setSelectCrds] = useState([])
  const [cardInfo, setCardInfo] = useState({});
  const token = useToken();
  const AddCard = useMutation({
    mutationFn: () => UserAPI.AddCard({ number: cardInfo.number, date: cardInfo.expiryMonth + "/" + cardInfo.expiryYear, name: cardInfo.brand, token }),
    mutationKey: ['addCard'],
  })

  const cardList = useQuery({

    queryFn: () => UserAPI.cardList({ token }),
    queryKey: ['cardList'],
    onSuccess(e) {
      const tmp = [];
      e.map((r, i) => {
        tmp.push({
          label: r.number,
          value: r,
          key: i
        });

        setSelectCrds(tmp)

      })
    }
  })

  const initPay = async () => {
    // const { client_secret,  publishableKey } = await fetchPaymentSheetParams();
    // console.log(client_secret, publishableKey);


    if (!client_secret) {
      payFailed(false)
      return Toast.show('pay error', { type: 'danger' });
    }
    Keyboard.dismiss();
    payStatus[1](true);
    const { paymentIntent, error } = await confirmPayment(client_secret, { paymentMethodType: 'Card' });

    if (error) {

      payFailed(false);
      payStatus[1](false);
      Toast.show('Payment failed');
      // console.error(error);
      Toast.show(error.localizedMessage)
    } else if (paymentIntent) {

      if (paymentIntent.status === 'Succeeded') {
        // 支付成功
        Toast.show('Payment Successful!');
        payFinish();
        payStatus[1](false);

      } else if (paymentIntent.status === 'requires_action') {
        // 需要进行额外的身份验证
        const { error: actionError, paymentIntent: confirmedIntent } = await handleCardAction(paymentIntent.client_secret);
        payStatus[1](false);
        if (actionError) {
          Toast.show('Payment failed');
          payFailed(false);
          addCard()
        } else if (confirmedIntent.status === 'succeeded') {
          // 验证成功
          Toast.show('Payment Successful');
          payFinish();
          addCard();
        } else {
          // 验证失败
          payFailed(false);
          console.log(confirmedIntent)
          Toast.show('Payment failed');
        }
      }
    }


  }

  const startPay = async () => {

    if (!payInfo[0]) return;

    initPay().catch().catch((er) => {
      console.log(er);
      payFailed(false)
      // Toast.show(er.message, { type: 'warning' })
    })

  }
  const addCard = () => {
    if (AddCard.isLoading) return;
    if (cardInfo.brand && cardInfo.complete) {
      AddCard.mutate(null, {
        onSuccess: (res) => {
          // Toast.show("Added successfully");
          // cardList.refetch();
          // setCardInfo({})
          // setVisible(false);
        },
        onError: (res) => {
          // Toast.show(res instanceof Error ? res.message : JSON.stringify(res))
        }
      })
    } else {
      Toast.show('invalid card!')
    }
  }

  useEffect(() => {

    initStripe({
      publishableKey: publishableKey,
      merchantIdentifier: "merchant.com.nextchoc",

    })
  }, [])


  return (<View style={{
    width: '100%', height: '100%',
    backgroundColor: '#fff'
  }}>

    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12, marginTop: 50 }}>
      <Pressable onPress={() => payFailed(true)} style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Credit/Debit Card Pay</Text>
    </View>



    <CardField
      postalCodeEnabled={false}
      placeholders={{

        number: "4258 1158 8055 5500",
        expiration: "4/24",
        cvc: "424"

      }}
      onCardChange={(e) => {
        console.log(e);
        payInfo[1](e);
        if (e.brand && e.complete) {
          setCardInfo(e);
        }


      }}

      autofocus={false}
      dangerouslyGetFullCardDetails={true}
      style={{ height: 60, margin: '5%' }}
      disabled={payStatus[0]}
    // cardStyle={{
    //   borderWidth: 1,
    //   cursorColor: config.primaryColor,
    //   borderRadius: 5,
    //   borderColor: config.primaryColor,
    //   backgroundColor: '#FFFFFF',
    //   textColor: '#000000',
    // }}
    />

    <View style={{ width: '90%', marginHorizontal: '5%' }}>
      <Text style={{ paddingBottom: 5, color: "gray", fontSize: 11 }}>For security reasons, you need to enter the card number.</Text>
      {
        cardList?.data?.length > 0 && <RNPickerSelect

          placeholder={{ label: 'Select Your Card', value: '' }}
          onValueChange={(value) => console.log(value)}
          items={selectCards}
        />
      }
    </View>

    {
      payStatus[0] ? <ActivityIndicator size={'large'} style={{ alignSelf: 'center', marginHorizontal: '10%', marginVertical: 10, marginTop: 20 }} /> :
        <Pressable style={{ backgroundColor: payInfo[0] ? config.primaryColor : 'gray', width: '90%', marginHorizontal: '5%', padding: 15, borderRadius: 5, marginTop: 20 }} onPress={startPay}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#fff', fontSize: 20 }}>Pay</Text>
        </Pressable>

    }



    <View style={{ marginTop: 16, display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', flexWrap: 'wrap', marginHorizontal: '5%' }}>

      <View style={{ display: 'flex', flexDirection: 'row' }}>

        <Text style={{ lineHeight: 20, textAlign: 'center', fontSize: 11, color: 'gray' }}>By paying in you have agreed to our </Text>
        {/* <Pressable style={{ marginTop: 12, display: 'flex', textAlign: 'center', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}> */}
        <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/terms-and-conditions/")}><Text numberOfLines={2} style={{ color: "#3567E7", lineHeight: 20, fontSize: 11 }}>Terms</Text></Pressable>
        <Text style={{ lineHeight: 20, fontSize: 14, color: 'gray' }}> & </Text>
        <Pressable onPress={() => Linking.openURL("https://nextchoc.com.au/privacy-policy/")}><Text numberOfLines={2} style={{ color: '#3567E7', lineHeight: 20, fontSize: 11 }}>Privacy policy</Text></Pressable>
        {/* </Pressable> */}
      </View>

    </View>
  </View>);
}


