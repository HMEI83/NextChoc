
import ResendLink from "../screens/Account/ForgetPassword/ResendLink";
import CheckEmail from "../screens/Account/ForgetPassword/CheckEmail";
import Verify from "../screens/Account/ForgetPassword/Verify";
import TelVerify from "../screens/Account/ForgetPassword/TelVerify";
import ResetPassword from "../screens/Account/ForgetPassword/ResetPassword";

export default function ForgetNavigation(Stack) {
  return (
    <Stack.Group
    >
       <Stack.Screen 
         name={"ForgetPassword.ResentLink"}
         component={ResendLink}
         options={{
          headerShown: false,
        }}
        />
        <Stack.Screen 
          name={"ForgetPassword.CheckEmail"}
          component={CheckEmail}
          options={{
            headerShown: false,
          }}
         />
           <Stack.Screen 
          name={"ForgetPassword.Verify"}
          component={Verify}
          options={{
            headerShown: false,
          }}
         />
         <Stack.Screen 
           name={"ForgetPassword.telver"}
           component={TelVerify}
           options={{
            headerShown:false
           }}
          />
          <Stack.Screen 
            name={'ForgetPassword.resetpsw'}
            component={ResetPassword}
            options={{
              headerShown:false,
            }}
           />
    </Stack.Group>
  );
}