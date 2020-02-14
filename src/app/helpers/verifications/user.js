import User from '../../models/User';

export const checkIsProvider = async userId =>
  User.findOne({
    where: { id: userId, provider: true },
  });

export default { checkIsProvider };
