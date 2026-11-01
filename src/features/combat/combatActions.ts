import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import { selectCombatPower } from '../../store/selectors';
import { attackBoss, healHero, resetBoss, takeDamage } from '../../store/slices/statsSlice';

const BOSS_COUNTER_DAMAGE = 12;

export const performCombatTurn = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>('combat/performTurn', async (_, { dispatch, getState }) => {
  const before = getState();
  if (before.stats.currentHp <= 0 || before.stats.bossHp <= 0) return;

  const damage = Math.max(1, Math.round(selectCombatPower(before) * 0.25));
  dispatch(attackBoss(damage));

  if (getState().stats.bossHp > 0) {
    dispatch(takeDamage(BOSS_COUNTER_DAMAGE));
  }
});

export const restartEncounter = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  'combat/restartEncounter',
  async (_, { dispatch }) => {
    dispatch(resetBoss());
    dispatch(healHero());
  },
);
