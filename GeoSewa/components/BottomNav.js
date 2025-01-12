import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';

const BottomNav = ({ navigation }) => {
  const [selectedNavItem, setSelectedNavItem] = useState();
  const navItems = [
    { name: 'HomeScreen', icon: 'home' },
    { name: 'ReportScreen', icon: 'report' },
    { name: 'My Reports', icon: 'description' },
    { name: 'ProfileScreen', icon: 'person' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      const currentRoute = navigation.getState().routes[navigation.getState().index]?.name;
      setSelectedNavItem(currentRoute);
    }, [navigation])
  );

  const handleNavItemPress = (name) => {
    setSelectedNavItem(name);
    if (name === 'HomeScreen') {
      navigation.navigate('HomeScreen');
    } else if (name === 'ReportScreen') {
      navigation.navigate('MapScreen');
    } else if (name === 'My Reports') {
      navigation.navigate('My Reports');
    } else {
      navigation.navigate('ProfileScreen');
    }
  };

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.navItem,
            selectedNavItem === item.name && styles.selectedNavItem,
          ]}
          onPress={() => handleNavItemPress(item.name)}
        >
          <Icon
            name={item.icon}
            size={30}
            color={selectedNavItem === item.name ? '#4C9BF1' : '#8F8F8F'}
            style={styles.navIcon}
          />
          <Text
            style={[
              styles.navText,
              { color: selectedNavItem === item.name ? '#4C9BF1' : '#8F8F8F' },
            ]}
          >
            {item.name.replace('Screen', '')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    elevation: 10, // For Android, higher elevation for a more pronounced shadow
    shadowColor: '#000', // Shadow color (black)
    shadowOpacity: 0.7, // Increase opacity for darker shadow
    shadowRadius: 10, // Increase the spread of the shadow
    shadowOffset: { width: 0, height: 4 }, // Offset the shadow for depth
    borderRadius: 15,
    height: 70,
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
  },
  
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  selectedNavItem: {
    backgroundColor: '#E5E5E9',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  navIcon: {
    marginBottom: 5,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default BottomNav;
