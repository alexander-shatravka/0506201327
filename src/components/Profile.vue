<template>
  <div class="profile-page">
    <div class="profile">
      <div class="profile-avatar">
        <img :src=profile.avatarImg
             v-bind:alt="profile.name">
      </div>
      <div class="profile-right">
        <div class="profile-header">
          <h2 class="profile-header-name">
            {{profile.name}}
          </h2>
          <span class="profile-header-position">
            {{profile.position}}
          </span>
          <p class="profile-header-status">
            {{profile.status}}
          </p>
        </div>
        <div class="profile-services">
          <span class="services-list-title">
            Услуг
          </span>
          <ul class="services-list">
            <li
              v-for="deal in profile.deals"
              class="service"
              :key="deal.id">
                <span class="service-name">
                  <span
                    class="service-background"
                    v-bind:style="{ width: deal.quantity/dealsTotal(profile.deals) * 100 + '%'}">
                  </span>{{deal.name}}
                </span>
              <span class="service-quantity">{{deal.quantity}}</span>
            </li>
          </ul>
          <div class="profile-services-footer">
            <strong>Всего</strong>
            <strong>{{dealsTotal(profile.deals)}}</strong>
          </div>
        </div>
      </div>
    </div>
    <div class="comments">
      <div class="comments-header">
        <div class="comments-header-left">
          <h2 class="comments-header-title">
            Последние отзывы
          </h2>
          <router-link
            to="/"
            class="comments-header-link">
            Все отзывы
          </router-link>
        </div>
        <div class="comments-header-right">
          <span class="likes-quantity">
            <i class="fas fa-heart" aria-hidden="true"></i>
            {{profile.likesQuantity}}
          </span>
          <span class="comments-quantity">
            <i class="fas fa-comment" aria-hidden="true"></i>
            {{profile.commentsQuantity}}
          </span>
        </div>
      </div>
      <ul class="comments-list">
        <li
          v-for="comment in profile.comments"
          class="review"
          :key="comment.id">
          <div class="review-header">
            <span class="review-name">
              {{comment.name}}
            </span>
            <span class="review-date">
              {{comment.date}}
            </span>
          </div>
          <p class="review-text">
            {{comment.text}}
          </p>
        </li>
      </ul>
    </div>
    <div class="comments-form">
      <form @submit.prevent="SendComment">
        <textarea
          @keyup.enter.ctrl="SendComment"
          type="text"
          class="comments-form-text"
          v-model="newComment"/>
        <span class="error"
          v-if="error">
          {{ error }}
        </span>
        <button class="comments-form-btn" type="submit">
          Написать консультанту
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import ProfileService from '@/services/ProfileService'
export default {
  name: 'ViewProfile',
  data () {
    return {
      profile: {},
      newComment: null,
      dateNow: this.getlocalDate(),
      error: null
    }
  },
  async created () {
    try {
      const profileId = this.$route.params.profileId
      this.profile = (await ProfileService.show(profileId)).data
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    dealsTotal (array) {
      let arr = array || ['not_empty']
      return arr.map((deal) => deal.quantity).reduce((total, dealQuantity) => total + dealQuantity)
    },
    async SendComment () {
      try {
        if (this.newComment.length > 10) {
          const comment = {
            name: '(Тестовый Пользователь)',
            text: this.newComment,
            dateNow: this.date
          }
          await ProfileService.update({...this.profile}).then(
            this.profile.comments.push(comment)
          )
          this.newComment = null
          this.error = null
        } else {
          this.error = 'Пожалуйста, введите комментарий содержащий более 10 символов'
          return false
        }
      } catch (err) {
        console.log(err)
      }
    },
    getlocalDate () {
      const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
      return `${new Date().getDate()} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './assets/main.scss';

  .profile-page {
    max-width: 720px;
    margin: 30px auto;
    overflow-x: hidden;
    * {
      outline: none;
    }
  }
  .profile {
    display: flex;
    padding-bottom: 9px;
    outline: none;
    text-align: left;
    @include breakpoint(sm) {
      flex-direction: column;
      align-items: center;
    }
    &-avatar {
      margin-right: 7px;
      width: 100%;
      max-width: 125px;
      max-height: 125px;
      position: relative;

      img {
        border-radius: 50%;
      }
    }
    &-right {
      width: 100%;
    }
    &-header {
      padding-top: 5px;
      &-position {
        font-size: 12px;
        line-height: 20px;
        color: #808080;
      }
      &-status {
        background: #FFFBC8;
        border: 1px solid #DADADA;
        box-sizing: border-box;
        border-radius: 5px;
        margin-left: -45px;
        margin-top: 10px;
        padding: 5px 8px 5px 45px;
        z-index: 0;
        line-height: 1.5;
      }
      @include breakpoint(sm) {
        text-align: center;
        &-status {
          padding: 5px;
          margin-left: 0;
        }
      }
    }
    &-services {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      align-items: flex-end;
      padding-top: 10px;
      &-footer {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 10px 40px 10px 0;
      }
    }
    .services-list {
      width: 100%;
      padding: 15px 40px 15px 0;
      border-top: 1px solid #DADADA;
      border-bottom: 1px solid #DADADA;
      @include breakpoint(sm) {
        padding: 15px 0;
      }
      &-title {
        font-size: 13px;
        line-height: 15px;
        padding-bottom: 10px;
        margin-right: 34px;
      }
      .service {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 0 0 0 6px;
        border-left: 1px solid rgba(51, 51, 51, 0.2);
        &:last-child {
          &-scale {
            bottom: 0;
          }
        }
        &-name {
          font-size: 13px;
          line-height: 200%;
          color: #333333;
        }
        &-quantity {
          font-weight: bold;
          font-size: 13px;
          line-height: 15px;
          color: #333333;
        }
        @-webkit-keyframes background_grow {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
        &-background {
          position: absolute;
          top: 0;
          bottom: 2px;
          left: 0;
          background: #ACE2F8;
          border-radius: 0 3px 3px 0;
          z-index: -1;
          width: 0;
          animation: background_grow 0.3s ease;
        }
        &:first-of-type {
          .service-background {
            background: #B1E19B;
          }
        }
      }
    }
  }

  .comments {
    text-align: left;
    &-header {
      display: flex;
      justify-content: space-between;
      &-righte, &-left {
        display: flex;
        align-items: flex-end;
      }
      &-right {
        font-size: 12px;
        display: flex;
        span {
          display: flex;
          align-items: center;
        }
        .likes-quantity {
          margin-right: 16px;
        }
        .fas {
          font-family:'Font Awesome 5 Free';
          font-style: normal;
          font-weight: 900;
          display: inline-block;
          margin-right: 5px;
          color: #73B3D4;
        }
      }
      &-title {
        font-weight: bold;
        font-size: 16px;
        line-height: 16px;
        padding-right: 10px;
      }
      &-link {
        font-size: 14px;
        line-height: 16px;
        color: #005DA1;
        text-decoration: underline;
      }
    }
    &-list {
      padding-bottom: 22px;
      .review {
        padding-top: 15px;
        &:last-child {
          margin-bottom: 0;
        }
        &-header {
          margin-bottom: 10px;
        }
        &-name {
          font-style: normal;
          font-weight: bold;
          font-size: 14px;
          line-height: 136%;
          color: #333333;
        }
        &-date {
          font-size: 12px;
          line-height: 167%;
          color: #808080;
        }
        .review-text {
          position: relative;
          color: #333333;
          padding: 15px 18px;
          font-size: 14px;
          line-height: 136%;
          text-align: left;
          background: #F2FBFF;
          border: 1px solid #C4CBCF;
          box-shadow: 0px 4px 10px rgba(128, 128, 128, 0.1);

          &:before {
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            left: 24px;
            top: -10px;
            border: 5px solid;
            border-color: transparent transparent #C4CBCF #C4CBCF;
          }
          &:after {
            content: ' ';
            position: absolute;
            left: 25px;
            top: -8px;
            border: 4px solid;
            border-color: transparent transparent #f2fbff #f2fbff;
          }
        }
      }
    }
    &-form {
      padding: 28px 21px 34px;
      background-color: #F2F2F2;
      position: relative;
      form {
        display: flex;
        flex-direction: column;
      }
      textarea {
        resize: none;
        transition: border-color 0.3s;
        &:focus {
          border-color: #fdd639;
        }
      }
      .error {
        position: static;
        width: 100%;
        text-align: center;
        padding: 0 0 20px;
      }
      &-text {
        margin-bottom: 23px;
        min-height: 63px;
        width: 100%;
      }
      &-btn {
        font-size: 14px;
        font-weight: bold;
        background-color: #fdd639;
        border: 0;
        padding: 11px;
        border-radius: 23px;
        width: 100%;
        max-width: 281px;
        margin: 0 auto;
        transition: background-color 0.3s ease;
        &:hover {
          background-color: darken(#fdd639, 15%);
        }
      }
    }
  }
</style>
