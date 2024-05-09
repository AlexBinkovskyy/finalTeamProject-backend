

export const checkTokenPlusUser = async (id, dbToken) => {
    const user = await User.findById(id, { password: 0 });
    if (!user) return false;
    const comparetokens = user.token === dbToken ? true : false;
    return comparetokens ? user : false;
  };

  export const deleteTokenFromUser = async (userData) => {
    userData.token = null;
    const user = await User.findByIdAndUpdate(userData.id, userData, {
      new: true,
    });
    return user ? true : false;
  };