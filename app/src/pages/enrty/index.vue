<script setup lang="ts">
import { ref, nextTick } from 'vue'
import PenPath from './PenPath.vue';

const name = ref('')

const beforeJoin = ref(false)
function toJoin() {
  beforeJoin.value = true;
  nextTick(() => {
    (document.querySelector('#numberInput') as HTMLInputElement).focus()
  })
}

function cancleJoin() {
  beforeJoin.value = false
}

const roomNumber = ref()
function join() {
  console.log(roomNumber.value)
}

function limitNumber() {
  roomNumber.value = roomNumber.value.replace(/[^0-9]/, '')
}


// todo 邀请用户
</script>

<template>
  <div class="enrty_con">
    <PenPath />
    <div class="entry_form_con">
      <div class="head">
        <span>You</span>
        <span>Draw</span>
        <span>I</span>
        <span>Guess</span>
      </div>
      <div class="form">
        <div class="name">
          <img src="../../assets/img/a.png" alt="">
          <label class="" for="name">
            昵称：
          </label>
          <input type="text" name="" id="name" v-model="name">
        </div>
        <div class="ops">
          <div class="btn create">创建房间</div>
          <div class="btn join" @click="toJoin">加入房间</div>
          <div class="btn join_random">随机加入</div>
        </div>
      </div>
    </div>
    <div class="join_dialog_shadow" v-if="beforeJoin">
      <div class="dialog_wrapper">
        <!-- 输入 -->
        <div class="join_number_inputer">
          <label for="numberInput">
            <span> 请输入房间号：</span>
            <span class="number_place"></span>
            <span class="number_place"></span>
            <span class="number_place"></span>
            <span class="number_place"></span>
            <span class="number_place"></span>
            <span class="number_place"></span>
          </label>
          <span class="cover"></span>
          <input type="text" id="numberInput" maxlength="6" v-model="roomNumber" @input="limitNumber">
        </div>
        <!-- 按钮 -->
        <div class="bts">
          <div class="btn confirm_join" @click="join">加入</div>
          <div class="btn cancle" @click="cancleJoin">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.enrty_con {
  height: 100%;
  position: relative;

  .entry_form_con {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    width: 640px;
    height: 400px;


    .head {
      line-height: 100px;
      text-align: center;
      font-size: 40px;
      font-weight: 600;

      letter-spacing: 10px;

      span {
        text-shadow: 1px 1px 3px #0c0c0c, -1px -1px 3px #fff;
        user-select: none;

        &:nth-child(odd) {
          color: #4fc2ff;
          display: inline-block;
          transform: translateY(-6px);
        }

        &:nth-child(even) {
          color: #f5c039;
        }
      }
    }

    .form {
      width: 600px;
      height: 160px;
      border-radius: 20px;
      padding: 20px;
      background-color: #fff;


      .name {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        font-size: 2rem;

        img {
          width: 42px;
        }

        label {
          padding: 0 10px;
        }

        input {
          font-size: 2rem;
          padding: 8px 0;
          border-bottom: 1px solid #ccc;
        }
      }

      .ops {
        display: flex;
        align-items: center;
        margin: 0 10px;
        justify-content: space-between;
        height: 100px;

        .btn {
          height: 42px;
          line-height: 42px;
          width: 170px;
          text-align: center;
          font-weight: 600;

          border-radius: 50px;
          box-shadow: 0 0 0 3px #000, 1px 1px 1px 0px #efefef inset;
          cursor: pointer;
        }

        .create {
          background-color: #13bafe;
        }

        .join {
          background-color: #ffbf00;
        }

        .join_random {
          background-color: #fd5c20;
        }
      }
    }

  }

  .join_dialog_shadow {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #0000005b;

    display: flex;
    justify-content: center;
    align-items: center;


    @keyframes showIn {
      from {
        transform: scale(1.1);
        opacity: 0.5;
      }

      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .dialog_wrapper {
      width: 460px;
      height: 200px;
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      animation: showIn 0.2s linear forwards;

      .join_number_inputer {
        height: 40px;
        display: flex;
        align-items: center;
        position: relative;
        margin-left: 38px; // 平衡两边空白举例

        input {
          width: 290px;
          font-size: 26px;
          letter-spacing: 29px;
          margin-left: 110px;
          padding-left: 17px;
          font-family: Monaco; // 需要使用等宽字体：Menlo，Monaco
        }

        label {
          position: absolute;
          left: 0;
          top: -2px;
          line-height: 40px;
          height: 40px;

          span {
            vertical-align: middle;
          }

          .number_place {
            display: inline-block;
            height: 38px;
            width: 38px;
            border: 1px solid #888;
            margin-left: 4px;
          }
        }

        // 遮挡光标 ，不能使用 overflow:hidden
        .cover {
          position: absolute;
          right: 0;
          top: 0;
          display: inline-block;
          width: 38px;
          height: 40px;
          background-color: #fff;
        }
      }

      .bts {
        margin-top: 50px;
        display: flex;
        width: 360px;
        justify-content: space-between;


        .btn {
          width: 160px;
          height: 36px;
          line-height: 36px;

          text-align: center;
          color: #fff;
          font-weight: bold;
          letter-spacing: 2px;

          background-color: #13bafe;
          border-radius: 20px;
          border: 2px solid #333;
          box-shadow: 1px 1px 1px 0 #ffff inset;

          cursor: pointer;
        }

        .cancle {
          background-color: #e4c348;
        }
      }
    }
  }
}
</style>