import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RecipesDashboardScreen from "../screens/RecipesDashboardScreen";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";
import CreateRecipeScreen from "../screens/CreateRecipeScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="LoginScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="RecipesDashboardScreen"
          component={RecipesDashboardScreen}
        />
        <Stack.Screen name="RecipeDetailsScreen" component={RecipeDetailsScreen} />
        <Stack.Screen name="CreateRecipeScreen" component={CreateRecipeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
