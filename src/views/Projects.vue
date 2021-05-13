<template>
    <div>
        <div class="page-intro-wrapper">
            <div class="project-users">
                <div class="user-group">
                    <img src="../assets/img/users/5.jpg" class="user-avatar" alt="">
                    <img src="../assets/img/users/4.jpg" class="user-avatar" alt="">
                    <img src="../assets/img/users/3.jpg" class="user-avatar" alt="">
                    <div class="more-user">18+</div>
                </div>
                <button type="button" class="btn-invite">
                    <i class="bi bi-person-plus"></i> Invite People
                </button>
            </div>
            <div class="project-labels">
                <div class="label">
                    <span class="label-dot important"/>
                    <h4 class="label-title">Important</h4>
                </div>
                <div class="label">
                    <span class="label-dot irrelevant"/>
                    <h4 class="label-title">Irrelevant</h4>
                </div>
                <div class="label">
                    <span class="label-dot default"/>
                    <h4 class="label-title">Default</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Projects'
    }
</script>